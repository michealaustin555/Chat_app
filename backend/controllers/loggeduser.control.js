import User from "../models/user.js";

export const loggeduserid = async (req,res)=>{
    try {
        const loggedID = req.user._id;

        const loggeduser = await User.find({_id:{ $ne : loggedID}}).select("-password");
        res.status(200).json(loggeduser);
        
    } catch (error) {
        console.log("Error in loggeduser controller:",error.message);
        res.status(500).json({message:error.message});
    }

};