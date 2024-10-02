import pg from "pg"; // นำเข้าทั้งหมดจาก pg
const { Pool } = pg; // ดึงค่า Pool จาก pg

export const PgConnect = () => {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  pool
    .connect()
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });

  return pool; // ส่งคืน pool ที่เชื่อมต่อแล้ว
};
