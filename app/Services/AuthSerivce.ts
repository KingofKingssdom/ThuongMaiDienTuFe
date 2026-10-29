import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const AuthService = {

    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${baseUrl}/Auth/login`, credentials);
            return response.data;
        } catch (error) {
            console.error("Lỗi gọi API đăng nhập:", error);
            throw error;
        }
    },

    register: async (userData: { fullName: string; email: string; password: string }) => {
        try {
            const response = await axios.post(`${baseUrl}/Auth/register`, userData);
            return response.data;
        } catch (error) {
            console.error("Lỗi gọi API đăng ký:", error);
            throw error;
        }
    }
};