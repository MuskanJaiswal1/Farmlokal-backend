import { Request, Response } from "express";
import { redis } from "../config/redis";

export async function handleWebhook(req: Request, res: Response) {
  const eventId = req.body?.eventId;

  if (!eventId) {
    return res.status(400).json({ message: "Missing eventId" });
  }

  const exists = await redis.get(`webhook:${eventId}`);

  if (exists) {
    return res.json({ message: "Duplicate event ignored" });
  }

  await redis.set(`webhook:${eventId}`, "processed", "EX", 3600);

  console.log("Processing webhook event:", eventId);

  res.json({ message: "Webhook processed" });
}
