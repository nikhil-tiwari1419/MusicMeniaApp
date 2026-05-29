import preferenceRepository from "../repositories/preferenceRepository.js";

class PreferenceService {
  async getPreference(userId, targetType, targetId) {
    return await preferenceRepository.findOne(userId, targetType, targetId);
  }

  async initializePreference(userId, targetType, targetId) {
    const existing = await this.getPreference(userId, targetType, targetId);
    if (existing) return existing;

    return await preferenceRepository.create({
      userId,
      targetType,
      targetId,
      score: 0,
      lastUpdated: new Date(),
    });
  }

  async updatePreferenceScore(userId, targetType, targetId, newScore) {
    return await preferenceRepository.updateScore(userId, targetType, targetId, newScore);
  }

  async getUserPreferences(userId, targetType) {
    return await preferenceRepository.findByUserId(userId, targetType);
  }

  async getTopPreferences(userId, targetType, limit) {
    return await preferenceRepository.findTopPreferences(userId, targetType, limit);
  }
}

export default new PreferenceService();
