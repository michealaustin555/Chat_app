import axioss from "../utils/axios";

export const loginapi = async(inputs)=>{
    const res = await axioss.post("api/auth/login",{
        username:inputs.username,
        password:inputs.password,
    });
    return res;
};