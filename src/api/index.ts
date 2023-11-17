import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key"
import axios from "axios"
const apiInstance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:2003/api" : "https://tekblog.up.railway.app/api"
})

apiInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
})

export default apiInstance
