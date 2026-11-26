import{mysqlTable,int} from "drizzle-orm/mysql-core";




export const tb_budgets = mysqlTable("tb_budgets",{
    budget_id:int().primaryKey().autoincrement(),
    allocated_amount:int().default(0),
    remaining_amout:int().default(0),
    
})