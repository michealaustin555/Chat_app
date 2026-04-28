import express from "express";
import { sendMessage , getMessage } from "../controllers/message.control.js";
import userExists from "../middleware/userExists.js";
const router = express.Router();

router.post("/send/:receiverID",userExists ,sendMessage);
router.get("/:id",userExists ,getMessage);

export default router;