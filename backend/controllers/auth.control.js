import express from "express";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import generatetoken from "../utiles/jwtokens.js";




export const signup = async(req,res)=>{
    try{
        const {fullname,username,password,confirmpassword,gender}= req.body; 
         
        if(password !== confirmpassword){
            return res.status(400).json({message:"The password is incorrect"});

        }
        const user = await User.findOne({username});
        if(user){
             return res.status(400).json({message:"The user is already exist"});
        }
       
        const salt = await bcrypt.genSalt(10);
        const hashing = await bcrypt.hash(password, salt);


        const boypic = "https://share.google/Rl7cWXo6TZRoLplkQ"
        const girlpic = "https://share.google/hcbYVW0IvmzWRTbPi"
        
        const newUser = new User ({
            fullname,
            username,
            password: hashing,
            gender,
            profilepic : gender === "male" ? boypic : girlpic
        })
        generatetoken(newUser._id,res);
        await newUser.save();


        res.status(201).json( {
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic
        } );
    }
    catch(err){
        res.status(500).json(err.message);
        
    }
    };

export const login = async (req,res)=>{
   try {
    const { username , password}= req.body;
    const user = await User.findOne({ username });
    const ispasswordcorrect = await bcrypt.compare(password,user.password);
    if(!user || !ispasswordcorrect){
        return res.status(400).json({message:"Invalid Username or Passsword"})
    }
    
    generatetoken(user._id, res);
    

    res.status(200).json( {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic
     } );
    
   } catch (error) {
    console.log("Error in login controller");
    res.status(500).json(error.message);
    
   }
};

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxage:0});
        res.status(200).json({message:"Logged out successfully"});
        
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({error:error.message});
        
    }
};

