import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/mysql";
import { redis } from "./config/redis";
import oauthRoutes from "./routes/oauthRoutes";
import externalRoutes from "./routes/externalRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FarmLokal Backend Running 🚀");
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    await redis.ping();

    res.send("MySQL + Redis connected ✅");
  } catch (err) {
    res.status(500).send("Connection failed ❌");
  }
});

app.get("/metrics", async (req, res) => {
  const redisInfo = await redis.info();
  res.send(redisInfo);
});


app.use("/oauth", oauthRoutes);
app.use("/external", externalRoutes);
app.use("/webhook", webhookRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
