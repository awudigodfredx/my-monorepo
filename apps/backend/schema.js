const {
  mysqlTable,
  int,
  varchar,
  timestamp,
} = require("drizzle-orm/mysql-core");

const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { messages };
