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

export async function GetProductByName(productName: string) {
    try {
        const response = await axios.get(`${baseUrl}/Product/search`, {
            params: {
                productName: productName
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}

export async function GetAllProductByCategoryAndBrand(categoryId: number, brandId: number | null) {
    try {
        const response = await axios.get(`${baseUrl}/Product/filter`, {
            params: {
                categoryId: categoryId,
                brandId: brandId
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}

// 2. Thêm mới sản phẩm (Dùng FormData vì có file ảnh)
export async function CreateProductService(formData: FormData, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/Product`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        throw error;
    }
}

// 3. Cập nhật sản phẩm
export async function UpdateProductService(id: number, formData: FormData, token: string) {
    try {
        const response = await axios.put(`${baseUrl}/Product/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        throw error;
    }
}

// 4. Xóa sản phẩm
export async function DeleteProductService(id: number, token: string) {
    try {
        const response = await axios.delete(`${baseUrl}/Product/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        throw error;
    }
}

// 5. Lấy danh sách biến thể theo ProductId (Giả định endpoint của bạn là /ProductVariant/product/{productId} hoặc tương tự)
export async function GetVariantsByProductIdService(productId: number) {
    try {
        // Hãy điều chỉnh lại đường dẫn endpoint này nếu backend của bạn đặt tên khác
        const response = await axios.get(`${baseUrl}/ProductVariant/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy biến thể sản phẩm:", error);
        throw error;
    }
}