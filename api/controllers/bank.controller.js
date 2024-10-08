import { PgConnect } from "../utils/config.js";

export const getDatas = async (req, res, next) => {
  console.log(req.query);

  const pool = PgConnect();

  try {
    const sortDirection = req.query.sort === "asc" ? "ASC" : "DESC";
    const month = req.query.month;
    const limit = parseInt(req.query.limit) || 10; // ค่าเริ่มต้นสำหรับ LIMIT
    let query = `SELECT * FROM bank`;
    let queryParams = []; // ใช้สำหรับแทนค่า $1, $2

    // กรองข้อมูลตามเดือน
    if (month && month !== "all") {
      query += ` WHERE month = $1`;
      queryParams.push(month);
    }

    // กรองข้อมูลตามช่วงอายุ
    if (req.query.ageRange && req.query.ageRange !== "all") {
      const [minAge, maxAge] = req.query.ageRange.split("-");
      if (queryParams.length > 0) {
        query += ` AND age BETWEEN $${queryParams.length + 1} AND $${
          queryParams.length + 2
        }`; // ใช้เลขดัชนีสำหรับพารามิเตอร์
        queryParams.push(minAge, maxAge);
      } else {
        query += ` WHERE age BETWEEN $1 AND $2`; // สำหรับกรณีที่ไม่มีเงื่อนไขอื่นก่อนหน้า
        queryParams.push(minAge, maxAge);
      }
    }

    // เรียงลำดับข้อมูลตาม id
    query += ` ORDER BY id ${sortDirection}`;

    // Query ข้อมูลทั้งหมด
    const fullResult = await pool.query(query, queryParams);

    // Query ข้อมูลตัวอย่างโดยใช้ LIMIT
    const previewQuery = query + ` LIMIT $${queryParams.length + 1}`; // เพิ่ม LIMIT ที่ท้าย query
    const previewParams = [...queryParams, limit]; // เพิ่มค่าจำกัดจำนวน (LIMIT) ใน queryParams
    const previewResult = await pool.query(previewQuery, previewParams);

    const totalDatas = fullResult.rowCount;
    const bankDatas = fullResult.rows; // ข้อมูลทั้งหมด
    const previewDatas = previewResult.rows; // ข้อมูลที่จำกัดตาม LIMIT

    // ส่งข้อมูลทั้งหมดและข้อมูลที่จำกัดจำนวนกลับไปยัง client
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
