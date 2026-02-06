import { pool } from "../config/mysql";

async function initDb() {
  try {
    console.log("Creating products table...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        price DECIMAL(10,2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ Products table created");
    
    console.log("Creating FULLTEXT index...");
    await pool.query(`
      CREATE FULLTEXT INDEX ft_products_name_desc ON products (name, description)
    `);
    
    console.log("✅ FULLTEXT index created");
    console.log("Database initialization complete!");
    process.exit(0);
  } catch (err: any) {
    if (err.code === 'ER_DUP_KEYNAME') {
      console.log("✅ Index already exists (that's fine)");
      process.exit(0);
    }
    console.error("Error initializing database:", err.message);
    process.exit(1);
  }
}

initDb();
