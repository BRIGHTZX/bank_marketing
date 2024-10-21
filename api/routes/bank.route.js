import express from "express";
import {
  createData,
  getDatas,
  getDetails,
} from "../controllers/bank.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getDatas", getDatas);
router.get("/getDetails", getDetails);
router.post("/createData", verifyToken, createData);

export default router;
