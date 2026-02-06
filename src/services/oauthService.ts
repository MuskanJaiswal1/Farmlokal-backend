// import axios from "axios";
// import { redis } from "../config/redis";

// const TOKEN_KEY = "oauth_token";

// let tokenPromise: Promise<string> | null = null;

// export async function getAccessToken(): Promise<string> {
//   const cachedToken = await redis.get(TOKEN_KEY);

//   if (cachedToken) {
//     return cachedToken;
//   }

//   // Prevent multiple simultaneous fetches
//   if (!tokenPromise) {
//     tokenPromise = fetchNewToken();
//   }

//   const token = await tokenPromise;
//   tokenPromise = null;

//   return token;
// }

// async function fetchNewToken(): Promise<string> {
//   console.log("Fetching new OAuth token...");

//   // Fake OAuth provider (mock)
//   const response = await axios.post(
//     "https://oauth2.googleapis.com/token",
//     new URLSearchParams({
//       client_id: "demo_client",
//       client_secret: "demo_secret",
//       grant_type: "client_credentials"
//     }),
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       }
//     }
//   );

//   const token = response.data.access_token || "mock_token";

//   const expiresIn = response.data.expires_in || 3600;

//   // Cache token slightly less than expiry
//   await redis.set(TOKEN_KEY, token, "EX", expiresIn - 60);

//   return token;
// }

import { redis } from "../config/redis";
import { v4 as uuidv4 } from "uuid";

const TOKEN_KEY = "oauth_token";

let tokenPromise: Promise<string> | null = null;

export async function getAccessToken(): Promise<string> {
  const cachedToken = await redis.get(TOKEN_KEY);

  if (cachedToken) {
    return cachedToken;
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

  await redis.set(TOKEN_KEY, token, "EX", expiresIn - 60);

  return token;
}
