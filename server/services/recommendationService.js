import Song from "../models/Song.js";
import Artist from "../models/Artist.js";
import preferenceRepository from "../repositories/preferenceRepository.js";
import interactionRepository from "../repositories/interactionRepository.js";
import redis from "../config/redis.js";

class RecommendationService {
  /**
   * Generates song recommendations for a user.
   */
  async getSongRecommendations(userId, limit = 20) {
    const cacheKey = `recommendations:songs:${userId}`;
    
    // Check Cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached).slice(0, limit);
    }

    // 1. Get user preferences
    const topGenres = await preferenceRepository.findTopPreferences(userId, "GENRE", 3);
    const topArtists = await preferenceRepository.findTopPreferences(userId, "ARTIST", 5);

    // 2. Candidate Discovery
    let candidates = [];

    if (topGenres.length > 0) {
      const genreNames = topGenres.map((p) => p.targetId);
      const genreSongs = await Song.find({ genre: { $in: genreNames } }).limit(limit * 2);
      candidates.push(...genreSongs);
    }

    if (topArtists.length > 0) {
      const artistIds = topArtists.map((p) => p.targetId);
      const artistSongs = await Song.find({ artistId: { $in: artistIds } }).limit(limit * 2);
      candidates.push(...artistSongs);
    }

    // Fallback if no preferences yet (Cold Start)
    if (candidates.length === 0) {
      candidates = await Song.find().limit(limit * 2);
    }

    // 3. Candidate Scoring & Deduping
    const scoredCandidates = await this._scoreCandidates(userId, candidates);

    // 4. Ranking & Filtering (Filtering recently played)
    const recentlyPlayed = await interactionRepository.findRecentByUserId(userId, 50);
    const playedSongIds = new Set(recentlyPlayed.filter(i => i.entityType === 'SONG').map(i => i.entityId.toString()));

    const filtered = scoredCandidates
      .filter(c => !playedSongIds.has(c._id.toString()))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    const result = filtered.slice(0, limit);

    // 5. Principle 2: Controlled Exploration
    // Occasionally inject a random trending song if the list is long enough
    if (result.length > 5 && Math.random() > 0.7) {
      const trending = await Song.find().limit(20);
      const randomSong = trending[Math.floor(Math.random() * trending.length)];
      if (!result.find(s => s._id.toString() === randomSong._id.toString())) {
        result[result.length - 1] = randomSong;
        console.log(`[RecommendationService] [Exploration] Injected random song: ${randomSong._id}`);
      }
    }
    
    // Store in Cache (1 hour TTL)
    await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
    console.log(`[RecommendationService] [Cache Repopulated] user:${userId}`);

    return result;
  }



  async _scoreCandidates(userId, songs) {
    const uniqueSongs = Array.from(new Map(songs.map(s => [s._id.toString(), s])).values());
    
    // Fetch preferences for scoring
    const artistPrefs = await preferenceRepository.findByUserId(userId, "ARTIST");
    const genrePrefs = await preferenceRepository.findByUserId(userId, "GENRE");

    const artistPrefMap = new Map(artistPrefs.map(p => [p.targetId.toString(), p.score]));
    const genrePrefMap = new Map(genrePrefs.map(p => [p.targetId.toString(), p.score]));

    return uniqueSongs.map(song => {
      const artistScore = artistPrefMap.get(song.artistId.toString()) || 0;
      const genreScore = genrePrefMap.get(song.genre) || 0;
      
      // Simple scoring formula: Artist Preference + Genre Preference
      // We can add popularity or freshness later.
      return {
        ...song.toObject(),
        recommendationScore: artistScore + genreScore
      };
    });
  }

  /**
   * Generates artist recommendations for a user.
   */
  async getArtistRecommendations(userId, limit = 10) {
    const topGenres = await preferenceRepository.findTopPreferences(userId, "GENRE", 3);
    
    let candidates = [];
    if (topGenres.length > 0) {
      const genreNames = topGenres.map(p => p.targetId);
      candidates = await Artist.find({ genres: { $in: genreNames } }).limit(limit * 2);
    } else {
      candidates = await Artist.find().limit(limit * 2);
    }

    // Score artists based on genre affinity
    const genrePrefs = await preferenceRepository.findByUserId(userId, "GENRE");
    const genrePrefMap = new Map(genrePrefs.map(p => [p.targetId, p.score]));

    const scored = candidates.map(artist => {
      let score = 0;
      artist.genres.forEach(g => {
        score += (genrePrefMap.get(g) || 0);
      });
      return { ...artist.toObject(), recommendationScore: score };
    });

    return scored
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }
  async getTrendingInGenres(userId, limit = 10) {
    const topGenres = await preferenceRepository.findTopPreferences(userId, "GENRE", 2);
    const genreNames = topGenres.map(p => p.targetId);
    return await Song.find({ genre: { $in: genreNames } }).limit(limit).populate("artistId");
  }

  async getDiscoveryContent(userId, limit = 10) {
    const topGenres = await preferenceRepository.findTopPreferences(userId, "GENRE", 5);
    const genreNames = topGenres.map(p => p.targetId);
    return await Song.find({ genre: { $nin: genreNames } }).limit(limit).populate("artistId");
  }

  async getNewReleases(limit = 10) {
    return await Song.find().sort({ createdAt: -1 }).limit(limit).populate("artistId");
  }

  async invalidateCache(userId) {
    await redis.del(`recommendations:songs:${userId}`);
    await redis.del(`recommendations:artists:${userId}`);
    await redis.del(`dashboard:${userId}`);
    console.log(`[RecommendationService] Cache invalidated for user ${userId}`);
  }
}

export default new RecommendationService();
