import { Router } from "express";
import { handleWebhook } from "../controllers/webHookController";

const router = Router();

router.post("/callback", handleWebhook);

export default router;
