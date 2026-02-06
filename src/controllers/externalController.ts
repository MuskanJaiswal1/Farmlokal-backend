import { Request, Response } from "express";
import { fetchExternalProducts } from "../services/externalApiService";

export async function getExternalProducts(req: Request, res: Response) {
  try {
    const products = await fetchExternalProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "External API failed" });
  }
}
