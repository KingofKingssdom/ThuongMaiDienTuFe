import axios from "axios";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export async function GetAllProductService() {

    try {
        const response = await axios.get(`${baseUrl}/Category`);
        return response.data;
    }
    catch (error) {
        console.error("lỗi gọi api")
    }
}