import {
  mysqlTable,
  varchar,
  mysqlEnum,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const tb_users = mysqlTable("tb_users", {
  user_id: varchar({ length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar({ length: 50 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  full_name: varchar({ length: 150 }).notNull(),
  phone_number: varchar({ length: 20 }).notNull().unique(),
  status: boolean().default(true).notNull(),
  role: mysqlEnum(["staff", "coach", "user", "admin"])
    .default("user")
    .notNull(),
  created_at: timestamp(),
});
