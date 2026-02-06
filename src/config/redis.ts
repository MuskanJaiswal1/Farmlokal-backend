import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL!, {
  tls: {},
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: () => true,
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  console.log("Redis connection error:", err.message);
});
