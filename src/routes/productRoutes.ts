import { Router } from "express";
import { getProductsController } from "../controllers/productController";
import { productRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/", productRateLimiter, getProductsController);

export default router;
