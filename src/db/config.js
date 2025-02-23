import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "0.0.0.0",
  database: process.env.PGDATABASE || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  port: parseInt(process.env.PGPORT || "5432"),
  ssl: { rejectUnauthorized: false },
});

export default pool;
