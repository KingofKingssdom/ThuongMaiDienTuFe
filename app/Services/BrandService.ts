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

// 1. Lấy tất cả thương hiệu
export async function GetAllBrandsService() {
    try {
        const response = await axios.get(`${baseUrl}/Brand`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thương hiệu:", error);
        throw error;
    }
}

// 2. Thêm mới thương hiệu (Dùng FormData vì có file ảnh)
export async function CreateBrandService(formData: FormData, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/Brand`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm thương hiệu:", error);
        throw error;
    }
}

// 3. Cập nhật thương hiệu
export async function UpdateBrandService(id: number, formData: FormData, token: string) {
    try {
        const response = await axios.put(`${baseUrl}/Brand/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thương hiệu:", error);
        throw error;
    }
}

// 4. Xóa thương hiệu
export async function DeleteBrandService(id: number, token: string) {
    try {
        const response = await axios.delete(`${baseUrl}/Brand/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa thương hiệu:", error);
        throw error;
    }
}




