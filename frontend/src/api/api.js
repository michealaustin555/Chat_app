import axioss from "../utils/axios";

export const signup = async(inputs,gender)=>{
    const res = await axioss.post("api/auth/signup",{
        fullname:inputs.fullname,
        username:inputs.username,
        password:inputs.password,
        confirmpassword:inputs.confirmpassword,
        gender:gender,
    });
    return res;
};