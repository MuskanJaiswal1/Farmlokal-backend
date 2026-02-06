import { Request, Response } from "express";
import { redis } from "../config/redis";

export async function handleWebhook(req: Request, res: Response) {
  const eventId = req.body?.eventId;

  if (!eventId) {
    return res.status(400).json({ message: "Missing eventId" });
  }

  // Check for duplicate events if Redis is available
  try {
    const exists = await redis.get(`webhook:${eventId}`);
    if (exists) {
      return res.json({ message: "Duplicate event ignored" });
    }
  } catch (err) {
    console.warn("Redis check failed in webhook, proceeding without deduplication:", err);
  }

  // Store event ID to prevent duplicates
  try {
    await redis.set(`webhook:${eventId}`, "processed", "EX", 3600);
  } catch (err) {
    console.warn("Redis set failed in webhook, duplicate detection unavailable:", err);
  }

  console.log("Processing webhook event:", eventId);

  res.json({ message: "Webhook processed" });
}
