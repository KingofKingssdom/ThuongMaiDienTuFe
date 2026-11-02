import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function CreateCartItemService(data: { productVariantId: number, quantity: number }, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/CartItem`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        throw error;
    }
}

export async function GetCartService(token: string) {
    const res = await axios.get(`${baseUrl}/CartItem`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}