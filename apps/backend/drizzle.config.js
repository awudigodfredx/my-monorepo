const { defineConfig } = require("drizzle-kit");

/** @type {import("drizzle-kit").Config} */
module.exports = defineConfig({
  schema: "./schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "@thegoddysmart2026",
    database: "demo",
  },
});
