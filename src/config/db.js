import { neon } from "@neondatabase/serverless";

import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export const initDB = async () => {
  try {
    // Create the transactions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,       
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
};
