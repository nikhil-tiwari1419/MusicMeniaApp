import { Queue } from "bullmq";
import { redisConfig } from "../config/redis.js";

// Initialize the interaction processing queue
export const interactionQueue = new Queue("interaction-queue", {
  connection: redisConfig,
});

// Function to add interaction to the queue
export const addInteractionToQueue = async (interaction) => {
  try {
    await interactionQueue.add("process-interaction", interaction, {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
  } catch (error) {
    console.error("Error adding to interaction queue:", error);
  }
};
