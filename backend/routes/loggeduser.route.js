import express from "express";
import { loggeduserid } from "../controllers/loggeduser.control.js";
import userExists from "../middleware/userExists.js";

const router = express.Router();

router.get("/", userExists ,loggeduserid);

export default router;