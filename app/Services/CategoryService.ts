import axios from "axios";

const baseUrl = "https://localhost:7276/api";

// 1. Lấy tất cả danh mục
export async function GetAllCategoriesService() {
    try {
        const response = await axios.get(`${baseUrl}/Category`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        throw error;
    }
}

// 2. Thêm mới danh mục
export async function CreateCategoryService(data: { categoryName: string }, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/Category`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        throw error;
    }
}

// 3. Cập nhật danh mục
export async function UpdateCategoryService(id: number, data: { categoryName: string }, token: string) {
    try {
        const response = await axios.patch(`${baseUrl}/Category/update/${id}`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        throw error;
    }
}

// 4. Xóa danh mục
export async function DeleteCategoryService(id: number, token: string) {
    try {
        const response = await axios.put(`${baseUrl}/Category/delete/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        throw error;
    }
}