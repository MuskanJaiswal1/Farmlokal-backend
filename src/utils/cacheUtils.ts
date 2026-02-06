import { redis } from "../config/redis";

export async function invalidateProductCache() {
  try {
    const keys = await redis.keys("products:*");

    if (keys.length) {
      await redis.del(keys);
    }
  } catch (err) {
    console.warn("Redis cache invalidation failed:", err);
  }
}
