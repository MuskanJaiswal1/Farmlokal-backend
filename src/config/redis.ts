import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create Redis client with error handling
const redisUrl = process.env.REDIS_URL;

export const redis = new Redis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true, // Don't connect immediately
});

// Handle Redis connection errors
redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

// Attempt to connect
redis.connect().catch((err) => {
  console.warn("⚠️ Redis connection failed - caching will be disabled:", err.message);
});
