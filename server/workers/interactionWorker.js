import { Worker } from "bullmq";
import { redisConfig } from "../config/redis.js";
import EWMAService from "../services/EWMAService.js";
import recommendationService from "../services/recommendationService.js";
import Song from "../models/Song.js";
import Artist from "../models/Artist.js";

const interactionWorker = new Worker(
  "interaction-queue",
  async (job) => {
    console.log(`👷 Processing interaction job ${job.id}...`);
    const interaction = job.data;

    try {
      // 1. Metadata Retrieval
      let metadata = {};
      if (interaction.entityType === "SONG") {
        const song = await Song.findById(interaction.entityId);
        if (song) {
          metadata.artistId = song.artistId;
          metadata.genres = [song.genre];
        }
      } else if (interaction.entityType === "ARTIST") {
        const artist = await Artist.findById(interaction.entityId);
        if (artist) {
          metadata.genres = artist.genres;
        }
      }

      // 2. EWMA Processing
      await EWMAService.processInteraction(interaction, metadata);

      // 3. Cache Invalidation
      // Significant interactions should trigger cache invalidation
      const significantTypes = ["LIKE", "FOLLOW", "SKIP", "PLAYLIST_ADD"];
      if (significantTypes.includes(interaction.interactionType)) {
        await recommendationService.invalidateCache(interaction.userId);
      }

      console.log(`✅ Interaction job ${job.id} processed successfully`);
    } catch (error) {
      console.error(`❌ Interaction job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConfig,
    concurrency: 5,
  }
);

interactionWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed!`);
});

interactionWorker.on("failed", (job, err) => {
  console.error(`⚠️ Job ${job.id} failed with error ${err.message}`);
});

export default interactionWorker;
