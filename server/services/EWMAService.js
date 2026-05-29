import preferenceService from "./preferenceService.js";

class EWMAService {
  constructor() {
    this.ALPHA = 0.3; // Decay factor (Recent behavior has 30% influence)
    this.WEIGHTS = {
      PLAY: 1,
      REPLAY: 2,
      LIKE: 3,
      PLAYLIST_ADD: 4,
      FOLLOW: 10,
      SKIP: -1,
    };
  }

  /**
   * Calculate updated EWMA score
   * Formula: New Score = (Alpha * Weight) + ((1 - Alpha) * Previous Score)
   */
  calculateNewScore(previousScore, weight) {
    return this.ALPHA * weight + (1 - this.ALPHA) * previousScore;
  }

  /**
   * Process an interaction and update all relevant preference scores
   */
  async processInteraction(interaction, metadata = {}) {
    const { userId, interactionType, entityType, entityId } = interaction;
    const weight = this.WEIGHTS[interactionType] || 0;

    if (weight === 0 && interactionType !== "SKIP") return; // Unknown interaction

    const results = [];

    // 1. Update Direct Entity Preference (Song or Artist)
    results.push(await this.updateScore(userId, entityType, entityId, weight));

    // 2. Update Associated Artist Preference (if song interaction)
    if (entityType === "SONG" && metadata.artistId) {
      results.push(await this.updateScore(userId, "ARTIST", metadata.artistId, weight));
    }

    // 3. Update Genre Preferences (if song/artist interaction and genres provided)
    if (metadata.genres && Array.isArray(metadata.genres)) {
      for (const genre of metadata.genres) {
        results.push(await this.updateScore(userId, "GENRE", genre, weight));
      }
    }

    return results;
  }

  async updateScore(userId, targetType, targetId, weight) {
    const preference = await preferenceService.getPreference(userId, targetType, targetId);
    const previousScore = preference ? preference.score : 0;
    const newScore = this.calculateNewScore(previousScore, weight);

    return await preferenceService.updatePreferenceScore(userId, targetType, targetId, newScore);
  }
}

export default new EWMAService();
