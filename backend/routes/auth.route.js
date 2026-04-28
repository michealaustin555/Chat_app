import express from "express";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import generatetoken from "../utiles/jwtokens.js";
import { login, logout, signup } from "../controllers/auth.control.js";



const router = express.Router();

router.post("/signup",signup);



//
router.post("/login", login);


router.post("/logout", logout);

export default router