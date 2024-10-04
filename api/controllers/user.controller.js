import { PgConnect } from "../utils/config.js";
import errorHandler from "../utils/error.js";

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  const pool = PgConnect();
  try {
    const result = await pool.query(
      "SELECT id ,username, email, isadmin, create_at FROM users"
    );

    const totalUsers = result.rowCount;
    const users = result.rows;

    res.status(200).json({
      users: users,
      count: totalUsers,
    });
  } catch (error) {
    next(error);
  }
};
