import { drizzle } from 'drizzle-orm/tidb-serverless';
import * from "./schema"
const db = drizzle(process.env.DATABASE_URL!,{schema});
