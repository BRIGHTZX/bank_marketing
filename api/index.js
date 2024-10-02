import express from "express";
import dotenv from "dotenv";
import cookiePaser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import bankRoutes from "./routes/bank.route.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookiePaser());
app.use(
  cors({
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});
