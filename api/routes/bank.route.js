import express from "express";
import { getDatas, getDetails } from "../controllers/bank.controller.js";

const router = express.Router();

router.get("/getDatas", getDatas);
router.get("/getDetails", getDetails);

export default router;
