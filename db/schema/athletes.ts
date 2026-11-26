import { mysqlTable ,varchar,json, boolean,timestamp} from "drizzle-orm/mysql-core";
import { tb_users } from "./users";
import{RadarChartData} from "@/types/athetes"


export const tb_athletes = mysqlTable("tb_athletes",{
    user_id:varchar({length:36}).notNull().references(()=>tb_users.user_id,{onDelete:"cascade"}),
    coach_id:varchar({length:36}).notNull().references(()=>tb_users.user_id,{onDelete:"cascade"}),
    primary_sport:varchar({length:(50)}).notNull(),
    consent_status:boolean().default(false).notNull(),
    radar_chart_data: json().$type<RadarChartData>(),
    selection_status:boolean().default(false).notNull(),
    registered_date:timestamp(),
})