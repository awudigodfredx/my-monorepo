const mysql = require("mysql2/promise");
const { drizzle } = require("drizzle-orm/mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "@thegoddysmart2026",
  database: "demo",
});

const db = drizzle(pool);

module.exports = { db };
