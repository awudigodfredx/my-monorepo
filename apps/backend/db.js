const mysql = require("mysql2/promise");
const { drizzle } = require("drizzle-orm/mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "@thegoddysmart2026",
  database: process.env.DB_NAME || "demo",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

const db = drizzle(pool);

module.exports = { db };
