import redis from "../config/redis.js";
import preferenceRepository from "../repositories/preferenceRepository.js";
import recommendationService from "./recommendationService.js";
import interactionRepository from "../repositories/interactionRepository.js";
import Song from "../models/Song.js";

class DashboardService {
  /**
   * Generates a personalized dashboard for the user.
   */
  async getPersonalizedDashboard(userId) {
    const cacheKey = `dashboard:${userId}`;

    // 1. Check Cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[DashboardService] [Cache Hit] user:${userId}`);
      return JSON.parse(cached);
    }
    console.log(`[DashboardService] [Cache Miss] user:${userId} - Generating fresh dashboard`);

    // Collect different sections in parallel for better performance
    const [
      recentlyPlayed,
      continueListening,
      recommendedSongs,
      recommendedArtists,
      trendingInGenres,
      discoveryContent,
      newReleases,
      topArtistPrefs
    ] = await Promise.all([
      this._getRecentlyPlayed(userId),
      this._getContinueListening(userId),
      recommendationService.getSongRecommendations(userId, 10),
      recommendationService.getArtistRecommendations(userId, 5),
      recommendationService.getTrendingInGenres(userId, 10),
      recommendationService.getDiscoveryContent(userId, 10),
      recommendationService.getNewReleases(10),
      preferenceRepository.findTopPreferences(userId, "ARTIST", 1)
    ]);

    const dashboard = {
      sections: [
        {
          id: 'recent',
          title: "Recently Played",
          type: "RECENTLY_PLAYED",
          data: recentlyPlayed
        },
        {
          id: 'continue',
          title: "Continue Listening",
          type: "CONTINUE_LISTENING",
          data: continueListening
        },
        {
          id: 'recommended',
          title: "Recommended for You",
          type: "RECOMMENDED_SONGS",
          data: recommendedSongs
        },
        {
          id: 'artists',
          title: "Artists You Might Like",
          type: "RECOMMENDED_ARTISTS",
          data: recommendedArtists
        },
        {
          id: 'trending',
          title: "Trending in Your Genres",
          type: "TRENDING_GENRES",
          data: trendingInGenres
        },
        {
          id: 'discovery',
          title: "Explore Something New",
          type: "DISCOVERY",
          data: discoveryContent
        },
        {
          id: 'new',
          title: "New Releases",
          type: "NEW_RELEASES",
          data: newReleases
        }
      ]
    };

    // 3. Adaptive Section Ordering Logic
    let sections = [...dashboard.sections];
    
    if (recentlyPlayed.length === 0) {
      // New User: Prioritize Discovery (Trending/Recommended)
      this._moveSection(sections, 'trending', 0);
      this._moveSection(sections, 'recommended', 1);
      this._moveSection(sections, 'recent', sections.length - 1);
      this._moveSection(sections, 'continue', sections.length - 1);
    } else if (topArtistPrefs.length > 0 && topArtistPrefs[0].score > 5) {
      // Mature User: Prioritize Personalization
      this._moveSection(sections, 'recommended', 0);
      this._moveSection(sections, 'artists', 1);
    }

    const finalDashboard = { sections };

    // 4. Store in Cache (1 hour TTL)
    await redis.set(cacheKey, JSON.stringify(finalDashboard), "EX", 3600);
    console.log(`[DashboardService] [Cache Repopulated] user:${userId}`);

    return finalDashboard;
  }

  /**
   * Helper to move a section to a specific index
   */
  _moveSection(sections, id, toIndex) {
    const fromIndex = sections.findIndex(s => s.id === id);
    if (fromIndex !== -1 && fromIndex !== toIndex) {
      const [element] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, element);
    }
  }

  async _getRecentlyPlayed(userId) {
    const interactions = await interactionRepository.findRecentByUserId(userId, 10);
    const songIds = interactions
      .filter(i => i.entityType === 'SONG')
      .map(i => i.entityId);
    
    // Fetch unique songs in recently played
    const uniqueIds = [...new Set(songIds.map(id => id.toString()))];
    return await Song.find({ _id: { $in: uniqueIds } }).populate("artistId");
  }

  async _getContinueListening(userId) {
    // In a full implementation, this would look for "PROGRESS" interactions.
    // For now, we'll just return the last 2 played songs.
    const interactions = await interactionRepository.findRecentByUserId(userId, 2);
    const songIds = interactions
      .filter(i => i.entityType === 'SONG')
      .map(i => i.entityId);
    
    return await Song.find({ _id: { $in: songIds } }).populate("artistId");
  }
}

export default new DashboardService();
