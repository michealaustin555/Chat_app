import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authroutes from "./routes/auth.route.js"
import messageroutes from "./routes/message.route.js"
import loggeduserroutes from "./routes/loggeduser.route.js"
import cors from "cors";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]

}));

await mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB is Connected"))
.catch((err)=>console.log(err.message));


app.use("/api/auth",authroutes);
app.use("/api/message",messageroutes);
app.use("/api/loggeduser",loggeduserroutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("/{*splat}", (req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
});


const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=> {
   
    console.log(`server is listening in port:${PORT}`)});
