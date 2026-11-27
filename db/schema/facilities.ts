
import { mysqlTable,int,varchar,timestamp,boolean,datetime} from "drizzle-orm/mysql-core";
import{tb_users} from "./users"

export const tb_facilties = mysqlTable("tb_facilties",{
    facility_id:int().primaryKey().autoincrement(),
    sfaff_id:varchar({ length: 36 }).notNull().references(() => tb_users.user_id, { onDelete: "restrict" }),
    facility_name:varchar({length:255}).notNull(),
    sport_type:varchar({length:150}).notNull(),
    max_player:int().default(1),
    open_time: datetime().notNull(),
    close_time: datetime().notNull(),
    status:boolean().default(true).notNull(),
    update_at:timestamp(),
})


export const tb_bookings = mysqlTable("tb_bookings",{
    booking_id:int().primaryKey().autoincrement(),
    user_id:varchar({ length: 36 }).notNull().references(() => tb_users.user_id, { onDelete: "restrict" }),
    facility_id:int().notNull().references(()=>tb_facilties.facility_id, { onDelete: "restrict" }),
    booking_code:varchar({length:20}).notNull().unique(),
    booking_date:timestamp(),
    booking_type:varchar({length:50}).notNull(),
    status:boolean().default(false).notNull(),
    checkin_time:datetime().notNull(),
})