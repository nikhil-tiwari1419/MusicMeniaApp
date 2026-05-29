import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
};

const redisConnection = new Redis(redisConfig);

redisConnection.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

redisConnection.on("connect", () => {
  console.log("✅ Redis Connected");
});

export default redisConnection;
export { redisConfig };
