import { redis } from "../config/redis";

export async function invalidateProductCache() {
  const keys = await redis.keys("products:*");

  if (keys.length) {
    await redis.del(keys);
  }
}
