import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function GetAllBrandByCategoryId(categoryId: number) {
    try {
        const response = await axios.get(`${baseUrl}/Brand/category`, {
            params: {
                categoryId: categoryId
            }

        });
        return response.data;
    }
    catch (error) {
        console.error("lỗi gọi api")
    }
}