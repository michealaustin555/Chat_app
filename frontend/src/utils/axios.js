import axios from "axios";

const axioss = axios.create({
    baseURL:"https://chat-app-iv4h.onrender.com",
    headers:{"Content-Type":"application/json"},
    withCredentials:true,
});

export default axioss;