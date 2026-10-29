// app/Services/VariantService.ts
import axios from "axios";

const baseUrl = "https://localhost:7276/api";

// 1. Lấy tất cả biến thể (hoặc lấy theo ProductId nếu backend hỗ trợ)
export async function GetAllVariantsService() {
    try {
        const response = await axios.get(`${baseUrl}/ProductVariant`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách biến thể:", error);
        throw error;
    }
}

// 2. Lấy biến thể theo ProductId
export async function GetVariantsByProductIdService(productId: number) {
    try {
        const response = await axios.get(`${baseUrl}/ProductVariant/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy biến thể theo sản phẩm:", error);
        throw error;
    }
}

// 3. Thêm mới biến thể (multipart/form-data)
export async function CreateVariantService(formData: FormData, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/ProductVariant`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm biến thể:", error);
        throw error;
    }
}

// 4. Cập nhật biến thể
export async function UpdateVariantService(id: number, formData: FormData, token: string) {
    try {
        const response = await axios.put(`${baseUrl}/ProductVariant/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật biến thể:", error);
        throw error;
    }
}

// 5. Xóa biến thể
export async function DeleteVariantService(id: number, token: string) {
    try {
        const response = await axios.delete(`${baseUrl}/ProductVariant/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa biến thể:", error);
        throw error;
    }
}