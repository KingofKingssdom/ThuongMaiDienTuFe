import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GetAllProductService(token: string) {

    try {
        const response = await axios.get(`${baseUrl}/Product`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("lỗi gọi api")
    }
}
export async function GetAllProductByPromotion(token: string) {

    try {
        const response = await axios.get(`${baseUrl}/Product/promotion`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("lỗi gọi api")
    }
}

export async function GetAllProductByIsFeature(categoryId: number, token: string) {
    try {
        const response = await axios.get(`${baseUrl}/Product/isfeature`, {
            params: {
                categoryId: categoryId
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}

export async function GetProductByName(productName: string, token: string) {
    try {
        const response = await axios.get(`${baseUrl}/Product/search`, {
            params: {
                productName: productName
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}
export async function GetProductById(id: number, token: string) {
    try {
        const response = await axios.get(`${baseUrl}/Product/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}
export async function GetAllProductByCategoryAndBrand(categoryId: number, brandId: number | null, token: string) {
    try {
        const response = await axios.get(`${baseUrl}/Product/filter`, {
            params: {
                categoryId: categoryId,
                brandId: brandId
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Lỗi gọi api")
    }
}

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

export async function UpdateProductService(id: number, formData: FormData, token: string) {
    try {
        const response = await axios.patch(`${baseUrl}/Product/update/${id}`, formData, {
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
        const response = await axios.put(`${baseUrl}/Product/delete/${id}`, {
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

// 5. Lấy danh sách biến thể theo ProductId 
export async function GetVariantsByProductIdService(productId: number, token: string) {
    try {

        const response = await axios.get(`${baseUrl}/ProductVariant/product/${productId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy biến thể sản phẩm:", error);
        throw error;
    }
}