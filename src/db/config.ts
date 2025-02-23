
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.REPLIT_DB_USER || "postgres",
  host: process.env.REPLIT_DB_HOST || "0.0.0.0",
  database: process.env.REPLIT_DB_NAME || "postgres",
  password: process.env.REPLIT_DB_PASSWORD || "postgres",
  port: parseInt(process.env.REPLIT_DB_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production"
});

export default pool;
