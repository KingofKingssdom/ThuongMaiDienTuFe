import axios from "axios";

const baseUrl = "https://localhost:7276/api";

// --- SPECIFICATION GROUPS ---
export async function GetAllGroupsService() {
    try {
        const res = await axios.get(`${baseUrl}/SpecificationGroup`);
        return res.data;
    }
    catch (error) {
        console.error("Lỗi lấy nhóm thông số sản phẩm: ", error);
        throw error;
    }

}

export async function CreateGroupService(data: { specificationName: string; categoryId: number }, token: string) {
    try {
        const res = await axios.post(`${baseUrl}/SpecificationGroup`, data, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        console.error("Lỗi tạo nhóm thông số sản phẩm: ", error)
        throw error;
    }

}

export async function UpdateGroupService(id: number, data: { specificationName: string; categoryId: number }, token: string) {
    try {
        const res = await axios.put(`${baseUrl}/SpecificationGroup/${id}`, data, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    }
    catch (error) {
        console.error("Lỗi cập nhập nhóm thông số sản phẩm: ", error)
        throw error;
    }

}

export async function DeleteGroupService(id: number, token: string) {
    try {
        const res = await axios.delete(`${baseUrl}/SpecificationGroup/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.data;
    }
    catch (error) {
        console.error("Lỗi xóa nhóm thông số sản phẩm: ", error);
        throw error;
    }

}

// --- SPECIFICATION ATTRIBUTES ---
export async function GetAllAttributesService() {
    const res = await axios.get(`${baseUrl}/SpecificationAttribute`);
    return res.data;
}

export async function CreateAttributeService(data: { labelSpecification: string; specificationGroupId: number }, token: string) {
    const res = await axios.post(`${baseUrl}/SpecificationAttribute`, data, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}

export async function UpdateAttributeService(id: number, data: { labelSpecification: string; specificationGroupId: number }, token: string) {
    const res = await axios.put(`${baseUrl}/SpecificationAttribute/${id}`, data, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}

export async function DeleteAttributeService(id: number, token: string) {
    const res = await axios.delete(`${baseUrl}/SpecificationAttribute/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}

// --- SPECIFICATION VALUES ---
export async function GetAllValuesService() {
    const res = await axios.get(`${baseUrl}/SpecificationValue`);
    return res.data;
}

export async function CreateValueService(data: { value: string; productId: number; specificationAttributeId: number }, token: string) {
    const res = await axios.post(`${baseUrl}/SpecificationValue`, data, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}

export async function UpdateValueService(id: number, data: { value: string; productId: number; specificationAttributeId: number }, token: string) {
    const res = await axios.put(`${baseUrl}/SpecificationValue/${id}`, data, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}

export async function DeleteValueService(id: number, token: string) {
    const res = await axios.delete(`${baseUrl}/SpecificationValue/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.data;
}