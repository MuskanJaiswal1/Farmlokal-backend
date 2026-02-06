import axios from "axios";
import CircuitBreaker from "opossum";

const MAX_RETRIES = 3;
const TIMEOUT = 2000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchProducts() {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await axios.get(
        "https://fakestoreapi.com/products",
        {
          timeout: TIMEOUT
        }
      );

      return response.data;

    } catch (error) {
      attempt++;

      if (attempt >= MAX_RETRIES) {
        throw new Error("External API failed after retries");
      }

      const backoff = Math.pow(2, attempt) * 500;
      console.log(`Retry attempt ${attempt} after ${backoff}ms`);

      await sleep(backoff);
    }
  }
}

const breaker = new CircuitBreaker(fetchProducts, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
});

breaker.fallback(() => {
  return { message: "External API temporarily unavailable" };
});

export async function fetchExternalProducts() {
  return breaker.fire();
}