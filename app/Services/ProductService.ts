import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GetAllProductService() {

    try {
        const response = await axios.get(`${baseUrl}/Product/promotion`);
        return response.data;
    }
    catch (error) {
        console.error("lỗi gọi api")
    }
}

export async function GetAllProductByIsFeature(categoryId: number) {
    try {
        const response = await axios.get(`${baseUrl}/Product/isfeature`, {
            params: {
                categoryId: categoryId
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}