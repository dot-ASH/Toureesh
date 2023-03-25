import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env["DB_USER"]}:${process.env["DB_PASS"]}@${process.env["DB_HOST"]}:${process.env["DB_PORT"]}/${process.env["DB_DATABASE"]}`;
export const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
});
