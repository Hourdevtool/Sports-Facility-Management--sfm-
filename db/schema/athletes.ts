import { mysqlTable ,varchar,time,datetime,json,int, boolean,timestamp,longtext,decimal} from "drizzle-orm/mysql-core";
import { tb_users } from "./users";
import { tb_facilties } from "./facilities";
import{RadarChartData} from "@/types/athetes"

export const tb_athletes = mysqlTable("tb_athletes",{
    user_id:varchar({length:36}).primaryKey().notNull().references(()=>tb_users.user_id,{onDelete:"cascade"}),
    coach_id:varchar({length:36}).notNull().references(()=>tb_users.user_id,{onDelete:"cascade"}),
    primary_sport:varchar({length:(50)}).notNull(),
    consent_status:boolean().default(false).notNull(),
    radar_chart_data: json().$type<RadarChartData>(),
    selection_status:boolean().default(false).notNull(),
    registered_date:timestamp(),
})

export const tb_training_records = mysqlTable("tb_training_records",{
    record_id: int().primaryKey().autoincrement(),
    athlete:varchar({length:36}).notNull().references(()=>tb_athletes.user_id,{onDelete:"cascade"}),
    coach_id:varchar({length:36}).notNull().references(()=>tb_users.user_id,{onDelete:"cascade"}),
    faci_id:int().notNull().references(()=>tb_facilties.facility_id,{onDelete:"cascade"}),
    training_date: datetime({ mode: "string" }).notNull(),
    start_time: time(),
    end_time: time(),
    attendance_status:boolean().default(false).notNull(),
    fitness_score:decimal({ precision: 12, scale: 2, mode: "number" }).default(0).notNull(),
    effort_score:decimal({ precision: 12, scale: 2, mode: "number" }).default(0).notNull(),
    coach_notes:longtext(),
})