import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const buildRedisConfig = () => {
  const baseConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null, // Required for BullMQ
  };

  if (!process.env.REDIS_URL) {
    return baseConfig;
  }

  try {
    const url = new URL(process.env.REDIS_URL);
    return {
      ...baseConfig,
      host: url.hostname,
      port: Number(url.port || 6379),
      username: url.username || undefined,
      password: url.password || undefined,
      tls: url.protocol === "rediss:" ? {} : undefined,
    };
  } catch (error) {
    console.error("❌ Invalid REDIS_URL, falling back to host/port:", error.message);
    return baseConfig;
  }
};

const redisConfig = buildRedisConfig();

const redisConnection = new Redis(redisConfig);

redisConnection.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

redisConnection.on("connect", () => {
  console.log("✅ Redis Connected");
});

export default redisConnection;
export { redisConfig };
