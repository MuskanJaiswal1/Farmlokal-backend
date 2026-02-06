import { Router } from "express";
import { getAccessToken } from "../services/oauthService";

const router = Router();

router.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Token fetch failed" });
  }
});

export default router;
