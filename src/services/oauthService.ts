import { redis } from "../config/redis";
import { v4 as uuidv4 } from "uuid";

const TOKEN_KEY = "oauth_token";

let tokenPromise: Promise<string> | null = null;

export async function getAccessToken(): Promise<string> {
  try {
    const cachedToken = await redis.get(TOKEN_KEY);
    if (cachedToken) {
      return cachedToken;
    }
  } catch (err) {
    console.warn("Redis get failed in oauth, generating new token:", err);
  }

  if (!tokenPromise) {
    tokenPromise = fetchNewToken();
  }

  const token = await tokenPromise;
  tokenPromise = null;

  return token;
}

async function fetchNewToken(): Promise<string> {
  console.log("Generating new OAuth token...");

  // Simulate external OAuth call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const token = uuidv4();
  const expiresIn = 3600;

  try {
    await redis.set(TOKEN_KEY, token, "EX", expiresIn - 60);
  } catch (err) {
    console.warn("Redis set failed in oauth, token will not be cached:", err);
  }

  return token;
}
