import {
  mysqlTable,
  int,
  varchar,
  decimal,
  datetime,
  text,
  boolean,
} from "drizzle-orm/mysql-core";
import { tb_budgets } from "./budgets";
import { tb_users } from "./users";
import { tb_facilties } from "./facilities";

export const tb_budget_requests = mysqlTable("tb_budget_requests", {
  request_id: int().primaryKey().autoincrement(),
  budget_id: int()
    .notNull()
    .references(() => tb_budgets.budget_id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  requester_id: varchar({ length: 36 })
    .notNull()
    .references(() => tb_users.user_id, { onDelete: "restrict" }),
  approved_by: varchar({ length: 36 }).references(() => tb_users.user_id, {
    onDelete: "set null",
  }),
  title: varchar({ length: 200 }).notNull(),
  total_estimated_amount: decimal({ precision: 10, scale: 2, mode: "number" })
    .default(0)
    .notNull(),
  status: varchar({ length: 20 }).default("PENDING").notNull(),
  actual_paid_amount: decimal({ precision: 10, scale: 2, mode: "number" }),
  approved_date: datetime(),
  created_at: datetime().$defaultFn(() => new Date()),
  docs_url: varchar({ length: 500 }),
});

export const tb_budget_request_items = mysqlTable("tb_budget_request_items", {
  item_id: int().primaryKey().autoincrement(),
  request_id: int()
    .notNull()
    .references(() => tb_budget_requests.request_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  item_name: varchar({ length: 200 }).notNull(),
  quantity: int().default(1).notNull(),
  unit_price: decimal({ precision: 10, scale: 2, mode: "number" })
    .default(0)
    .notNull(),
  total_price: decimal({ precision: 10, scale: 2, mode: "number" })
    .default(0)
    .notNull(),
});

export const tb_repairs = mysqlTable("tb_repairs", {
  repair_id: int().primaryKey().autoincrement(),
  reporter_id: varchar({ length: 36 })
    .notNull()
    .references(() => tb_users.user_id, { onDelete: "restrict" }),
  facility_id: int()
    .notNull()
    .references(() => tb_facilties.facility_id, { onDelete: "restrict" }),
  title: varchar({ length: 200 }).notNull(),
  description: text().notNull(),
  severity_level: varchar({ length: 20 }).default("MEDIUM").notNull(),
  is_petty_cash: boolean().default(true).notNull(),
  budget_request_id: int().references(() => tb_budget_requests.request_id, {
    onDelete: "set null",
  }),
  actual_cost: decimal({ precision: 10, scale: 2, mode: "number" })
    .default(0)
    .notNull(),
  image_url: varchar({ length: 500 }),
  status: varchar({ length: 20 }).default("REPORTED").notNull(),
  created_at: datetime()
    .$defaultFn(() => new Date())
    .notNull(),
  completed_at: datetime(),
});
