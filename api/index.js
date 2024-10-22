import express from "express";
import dotenv from "dotenv";
import cookiePaser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import bankRoutes from "./routes/bank.route.js";
import path from "path";

dotenv.config();
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookiePaser());

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
