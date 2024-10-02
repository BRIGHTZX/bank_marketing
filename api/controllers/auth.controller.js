import errorHandler from "../utils/error.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import { PgConnect } from "../utils/config.js";

export const signup = async (req, res, next) => {
  let { username, email, password } = req.body;

  // Trim whitespace
  username = username?.trim();
  email = email?.trim();
  password = password?.trim();

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const pool = PgConnect();
  try {
    // สร้างตาราง users ถ้ายังไม่มี
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    return next(errorHandler(500, "Internal Server Error"));
  } finally {
    pool.end();
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const pool = PgConnect();
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const User = result.rows[0];
    console.log(User);

    if (!User) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, User.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = await jwt.sign(
      { email: User.email, username: User.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    const { password: pass, ...rest } = User;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: false,
      })
      .json({ user: rest, message: "Login Success" });
  } catch (error) {
    console.error("Error details:", error); // Log the error for debugging
    return next(errorHandler(500, error.message || "Internal Server Error"));
  } finally {
    pool.end();
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};
