import express from "express";
import {
  createData,
  getDatas,
  getDetails,
} from "../controllers/bank.controller.js";

const router = express.Router();

router.get("/getDatas", getDatas);
router.get("/getDetails", getDetails);
router.post("/createData", createData);

export default router;
