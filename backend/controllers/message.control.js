import userExists from "../middleware/userExists.js"
import Conversation from "../models/coversation.js"
import Message from "../models/message.js"
import mongoose from "mongoose"


export const sendMessage = async(req , res)=>{
   try {
        
    const {message} = req.body;
    const receiverID = req.params.receiverID;
    const senderID = req.user._id;
    
        
    let conversation = await Conversation.findOne(
       { participants:{$all:[senderID,receiverID]}
    });
      

    if(!conversation){
    conversation = await Conversation.create({
        participants:[senderID,receiverID]
    })}
    
    const newMessage = new Message({
        senderId:senderID,
        receiverId:receiverID,
        message:message
    });
    
    if(newMessage){
        conversation.messages.push(newMessage._id);
    }
    
    await Promise.all([newMessage.save(),conversation.save()]);
      
   
    res.status(201).json(newMessage);
   
   } 
   catch (error) {
     console.log("Error in sendMessage controller",error.message);
     res.status(500).json({message:error.message});
   }
}

export const getMessage = async(req,res)=>{
    try {
        const {id:chaterTOReceiverID} = req.params;
        const senderID = req.user._id;

        const converstaion = await Conversation.findOne({
            participants:{$all : [ senderID , chaterTOReceiverID]}
        }).populate("messages");

        if(!converstaion){ return res.status(200).json([]);}
        

        const mes = converstaion.messages;

        res.status(201).json(mes);

    } catch (error) {
        console.log("Error in getMessage controller",error.message);
        res.status(500).json({message:error.message});
    }

    


}