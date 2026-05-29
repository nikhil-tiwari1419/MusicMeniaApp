import Preference from "../models/Preference.js";

class PreferenceRepository {
  async findOne(userId, targetType, targetId) {
    return await Preference.findOne({ userId, targetType, targetId });
  }

  async create(preferenceData) {
    return await Preference.create(preferenceData);
  }

  async updateScore(userId, targetType, targetId, newScore) {
    return await Preference.findOneAndUpdate(
      { userId, targetType, targetId },
      { score: newScore, lastUpdated: new Date() },
      { returnDocument: "after", upsert: true }
    );
  }

  async findByUserId(userId, targetType) {
    const query = { userId };
    if (targetType) query.targetType = targetType;
    return await Preference.find(query).sort({ score: -1 });
  }

  async findTopPreferences(userId, targetType, limit = 10) {
    return await Preference.find({ userId, targetType })
      .sort({ score: -1 })
      .limit(limit);
  }
}

export default new PreferenceRepository();
