import interactionRepository from "../repositories/interactionRepository.js";
import { addInteractionToQueue } from "./queueService.js";

class InteractionService {
  async recordInteraction(interactionData) {
    // 1. Validation
    const { userId, interactionType, entityType, entityId } = interactionData;
    if (!userId || !interactionType || !entityType || !entityId) {
      throw new Error("Missing required interaction fields");
    }

    // 2. Storage
    const interaction = await interactionRepository.create({
      userId,
      interactionType,
      entityType,
      entityId,
      timestamp: new Date(),
    });

    // 3. Publish Processing Job (Phase 7)
    await addInteractionToQueue(interaction);

    console.log(`[InteractionService] Interaction recorded: ${interaction._id}. Queued for processing.`);

    return interaction;
  }

  async getUserHistory(userId) {
    return await interactionRepository.findByUserId(userId);
  }

  async getRecentHistory(userId, limit) {
    return await interactionRepository.findRecentByUserId(userId, limit);
  }
}

export default new InteractionService();
