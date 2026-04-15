const {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
} = require("drizzle-orm/mysql-core");

const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const heroLeads = mysqlTable("hero_leads", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { messages, heroLeads };
