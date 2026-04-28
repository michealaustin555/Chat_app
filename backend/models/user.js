import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:true,
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minlenght:6
    },
    gender:{
        type:String,
        require:true,
        enum:["male","female"]
    },
    profilepic:{
        type:String,
        default:""
    }
},{timestamps:true})
const User = mongoose.model("User",userSchema);

export default User;
