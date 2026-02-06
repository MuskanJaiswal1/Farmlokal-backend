import type { RowDataPacket } from "mysql2/promise";
import { pool } from "../config/mysql";

interface ProductQuery {
  cursor?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export interface ProductRow extends RowDataPacket {
  id: number;
}

export async function getProducts(query: ProductQuery): Promise<ProductRow[]> {
  const {
    cursor = 0,
    limit = 20,
    category,
    search,
    sort = "id"
  } = query;

  let sql = `SELECT * FROM products WHERE id > ?`;
  const params: any[] = [cursor];

  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }

  if (search) {
    sql += ` AND MATCH(name, description) AGAINST(?)`;
    params.push(search);
  }

  const allowedSort = ["price", "createdAt", "name", "id"];
  const sortField = allowedSort.includes(sort) ? sort : "id";

  sql += ` ORDER BY ${sortField} ASC LIMIT ?`;
  params.push(Number(limit));

  const [rows] = await pool.query<ProductRow[]>(sql, params);

  return rows;
}
