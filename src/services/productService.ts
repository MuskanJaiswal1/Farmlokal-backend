import { redis } from "../config/redis";
import { getProducts } from "../repositories/productRepository";

export async function getProductsService(query: any) {
  const cacheKey = `products:${JSON.stringify(query)}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await getProducts(query);

  const lastItem = products[products.length - 1];

  const response = {
    data: products,
    nextCursor: lastItem ? lastItem.id : null
  };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

  return response;
}
