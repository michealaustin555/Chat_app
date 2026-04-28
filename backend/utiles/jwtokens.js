import jwt from 'jsonwebtoken';

const generatetoken =(userID,res)=>{
    const token = jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    res.cookie("jwt",token,{
        maxage: 15 * 24 * 60 * 60 *1000,
        httpOnly: true,
        samesite: "strict",
        secure:process.env.NODE_env !== "development"

    })
}
export default generatetoken;