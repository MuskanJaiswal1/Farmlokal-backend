import { pool } from "../config/mysql";

const categories = ["milk", "vegetables", "fruits", "grocery"];

function randomPrice() {
  return (Math.random() * 500).toFixed(2);
}

async function seedProducts() {
  console.log("Seeding products...");

  for (let i = 1; i <= 10000; i++) {
    await pool.query(
      `INSERT INTO products (name, description, category, price)
       VALUES (?, ?, ?, ?)`,
      [
        `Product ${i}`,
        `Description for product ${i}`,
        categories[i % categories.length],
        randomPrice()
      ]
    );

    if (i % 1000 === 0) {
      console.log(`Inserted ${i} products`);
    }
  }

  console.log("Seeding complete");
  process.exit();
}

seedProducts();
