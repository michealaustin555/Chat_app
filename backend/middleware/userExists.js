import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userExists= async (req,res,next)=>{
        try {
      
        const token =  req.cookies.jwt;
        
        if(!token){
            return
            res.status(401).json({error:"Unauthorized - invalid token"},error.message);
        }
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return
           res.status(401).json({error:"Unauthorized - invalid token"},error.message);
        
        }
        
        const user = await User.findById(decoded.userID).select("-password");
        if(!user){
            return         
            res.status(400).json({message:"User not found"});
        }

        req.user = user;

        next();


        
    } catch (error) {
        return
        console.log("userExisted is not found",error);
        res.status(500).json({message:error.message});
    }

}
export default userExists;
