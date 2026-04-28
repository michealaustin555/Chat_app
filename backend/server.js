import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authroutes from "./routes/auth.route.js"
import messageroutes from "./routes/message.route.js"
import loggeduserroutes from "./routes/loggeduser.route.js"

const app = express();


app.use(express.json());
app.use(cookieParser());

await mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB is Connected"))
.catch((err)=>console.log(err.message));
console.log(process.env.MONGO_URL);
console.log(mongoose.connection.name)

app.use("/api/auth",authroutes);
app.use("/api/message",messageroutes);
app.use("/api/loggeduser",loggeduserroutes);

const PORT= process.env.PORT || 8000;
app.listen(PORT, ()=> {
   
    console.log(`server is listening in port:${PORT}`)});
