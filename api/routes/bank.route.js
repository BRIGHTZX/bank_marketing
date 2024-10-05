import express from "express";
import { getDatas } from "../controllers/bank.controller.js";

const router = express.Router();

router.get("/getDatas", getDatas);

export default router;
