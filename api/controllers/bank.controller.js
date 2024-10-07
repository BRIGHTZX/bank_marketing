import { PgConnect } from "../utils/config.js";

export const getDatas = async (req, res, next) => {
  console.log(req.query);

  const pool = PgConnect();

  try {
    const sortDirection = req.query.sort === "asc" ? "ASC" : "DESC";
    const month = req.query.month;

    // สร้างเงื่อนไขในการกรองข้อมูลตามเดือน
    let query = `SELECT * FROM bank`;
    let queryParams = []; //ไว้แทนค่า $1

    if (month && month !== "all") {
      query += ` WHERE month = $1`;
      queryParams.push(month);
    }

    query += ` ORDER BY id ${sortDirection}`;

    // เรียกข้อมูลจากฐานข้อมูล
    const result = await pool.query(query, queryParams);

    const totalDatas = result.rowCount;
    const bankDatas = result.rows;
    const previewDatas = result.rows.slice(0, 10);

    // ส่งข้อมูลกลับไปยัง client
    res.status(200).json({
      totalDatas: totalDatas,
      bankDatas: bankDatas,
      previewDatas: previewDatas,
    });
  } catch (error) {
    next(error);
  } finally {
    await pool.end();
  }
};
