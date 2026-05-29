import Interaction from "../models/Interaction.js";

class InteractionRepository {
  async create(interactionData) {
    return await Interaction.create(interactionData);
  }

  async findByUserId(userId, limit = 100) {
    return await Interaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async findRecentByUserId(userId, limit = 10) {
    return await Interaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async findById(id) {
    return await Interaction.findById(id);
  }
}

export default new InteractionRepository();
