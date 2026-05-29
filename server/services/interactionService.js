import interactionRepository from "../repositories/interactionRepository.js";
import { addInteractionToQueue } from "./queueService.js";
import mongoose from "mongoose";

const VALID_INTERACTION_TYPES = new Set([
  "PLAY",
  "REPLAY",
  "LIKE",
  "PLAYLIST_ADD",
  "FOLLOW",
  "SKIP",
]);

const VALID_ENTITY_TYPES = new Set(["SONG", "ARTIST", "PLAYLIST"]);

class InteractionService {
  async recordInteraction(interactionData) {
    // 1. Validation
    const { userId, interactionType, entityType, entityId } = interactionData;
    if (!userId || !interactionType || !entityType || !entityId) {
      throw new Error("Missing required interaction fields");
    }

    if (!VALID_INTERACTION_TYPES.has(interactionType)) {
      throw new Error("Invalid interaction type");
    }

    if (!VALID_ENTITY_TYPES.has(entityType)) {
      throw new Error("Invalid entity type");
    }

    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      throw new Error("Invalid entity id");
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
