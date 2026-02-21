const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
    multipleStatements: true,
  });

  try {
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'add_size_systems.sql');
    const sql = fs.readFileSync(migrationPath, "utf8");

    console.log("Running migration...");
    await connection.query(sql);
    console.log("✅ Migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
