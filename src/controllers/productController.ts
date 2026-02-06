import { Request, Response } from "express";
import { getProductsService } from "../services/productService";

export async function getProductsController(req: Request, res: Response) {
  try {
    const products = await getProductsService(req.query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
