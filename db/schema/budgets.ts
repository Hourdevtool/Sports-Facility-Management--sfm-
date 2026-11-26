
import { mysqlTable, int, varchar, decimal } from "drizzle-orm/mysql-core";
import { tb_users } from "./users";




export const tb_fiscal_years = mysqlTable("tb_fiscal_years", {
    fiscal_id: int().primaryKey().autoincrement(),
    years: varchar({ length: 4 })
})


export const tb_budgets = mysqlTable("tb_budgets", {
    budget_id: int().primaryKey().autoincrement(),
    fiscal_id: int().notNull().references(() => tb_fiscal_years.fiscal_id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    allocated_amount: decimal({ precision: 12, scale: 2, mode: "number" }).default(0).notNull(),
    remaining_amout: decimal({ precision: 12, scale: 2, mode: "number" }).default(0).notNull(),

})


export const tb_budgets_detail = mysqlTable("tb_budgets_detail", {
    detail_id: int().primaryKey().autoincrement(),
    budget_id: int().notNull().references(() => tb_budgets.budget_id, {
        onDelete: "cascade"
    }),
    create_by: varchar({ length: 36 }).notNull().references(() => tb_users.user_id, { onDelete: "restrict" }),
    Amount: decimal({ precision: 12, scale: 2, mode: "number" }).default(0).notNull(),
    Source: varchar({ length: 255 }),
})