import express from "express";
import { getdatas } from "../controllers/bank.controller.js";

const router = express.Router();

router.get("/getdatas", getdatas);

export default router;
