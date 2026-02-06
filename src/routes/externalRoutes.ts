import { Router } from "express";
import { getExternalProducts } from "../controllers/externalController";

const router = Router();

router.get("/products", getExternalProducts);

export default router;
