import { pgTable, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";
export const User = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email").notNull().unique(),
  },
  (table) => {
    return {
      emailInedx: uniqueIndex("emailIndex").on(table.email),
    };
  },
);
