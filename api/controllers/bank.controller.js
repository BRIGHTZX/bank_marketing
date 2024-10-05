import { PgConnect } from "../utils/config.js";

export const getDatas = async (req, res, next) => {
  const pool = PgConnect();
  try {
    const result = await pool.query("SELECT * FROM bank");
    const totalDatas = result.rowCount;
    const bankDatas = result.rows;

    res.status(200).json({
      totalDatas: totalDatas,
      bankDatas: bankDatas,
    });
  } catch (error) {
    next(error);
  } finally {
    pool.end;
  }
};
