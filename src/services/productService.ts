import { redis } from "../config/redis";
import { getProducts } from "../repositories/productRepository";

export async function getProductsService(query: any) {
  const cacheKey = `products:${JSON.stringify(query)}`;

  // Try to get from cache, but don't fail if Redis is unavailable
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Redis get failed, fetching from database:", err);
  }

  const products = await getProducts(query);

  const lastItem = products[products.length - 1];

  const response = {
    data: products,
    nextCursor: lastItem ? lastItem.id : null
  };

  // Try to cache, but don't fail if Redis is unavailable
  try {
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
  } catch (err) {
    console.warn("Redis set failed, continuing without cache:", err);
  }

  return response;
}
