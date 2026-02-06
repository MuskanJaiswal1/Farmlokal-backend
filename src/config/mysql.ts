import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const mysqlUrl = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

export const pool = mysqlUrl
  ? mysql.createPool(mysqlUrl)
  : mysql.createPool({
      host: process.env.MYSQL_HOST || process.env.MYSQLHOST,
      port: Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306),
      user: process.env.MYSQL_USER || process.env.MYSQLUSER,
      password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD,
      database: process.env.MYSQL_DB || process.env.MYSQLDATABASE,
      connectionLimit: 10
    });
