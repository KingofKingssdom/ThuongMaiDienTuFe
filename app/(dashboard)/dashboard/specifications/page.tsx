"use client"
import React, { useState, useEffect } from "react";
import {
    GetAllGroupsService, CreateGroupService, UpdateGroupService, DeleteGroupService,
    GetAllAttributesService, CreateAttributeService, UpdateAttributeService, DeleteAttributeService,
    GetAllValuesService, CreateValueService, UpdateValueService, DeleteValueService
} from "@/app/Services/SpecificationService";
import { GetAllCategoriesService } from "@/app/Services/CategoryService";
import { GetAllProductService } from "@/app/Services/ProductService";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

interface Category { id: number; categoryName: string; }
interface Product { id: number; productName: string; }
interface SpecGroup { id: number; specificationName: string; categoryId: number; category?: Category; }
interface SpecAttribute { id: number; labelSpecification: string; specificationGroupId: number; specificationGroup?: SpecGroup; }
interface SpecValue {
    id: number;
    value: string;
    productId: number;
    specificationAttributeId: number;
    product?: Product;
    specificationAttribute?: SpecAttribute;
}

export default function SpecificationAdminPage() {
    const [activeTab, setActiveTab] = useState<"values" | "attributes" | "groups">("values");

    // Data states
    const [groups, setGroups] = useState<SpecGroup[]>([]);
    const [attributes, setAttributes] = useState<SpecAttribute[]>([]);
    const [values, setValues] = useState<SpecValue[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal & Form states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"group" | "attribute" | "value">("value");
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Form fields cho Group
    const [groupName, setGroupName] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");

    // Form fields cho Attribute
    const [labelSpec, setLabelSpec] = useState("");
    const [groupId, setGroupId] = useState<number | "">("");

    // Form fields cho Value
    const [specValue, setSpecValue] = useState("");
    const [productId, setProductId] = useState<number | "">("");
    const [attributeId, setAttributeId] = useState<number | "">("");

    const [submitting, setSubmitting] = useState(false);

    // Tải toàn bộ dữ liệu
    const loadData = async () => {
        setLoading(true);
        try {
            const [groupRes, attrRes, valRes, catRes, prodRes] = await Promise.all([
                GetAllGroupsService(),
                GetAllAttributesService(),
                GetAllValuesService(),
                GetAllCategoriesService(),
                GetAllProductService()
            ]);
            setGroups(groupRes.data || groupRes || []);
            setAttributes(attrRes.data || attrRes || []);
            setValues(valRes.data || valRes || []);
            setCategories(catRes.data || catRes || []);
            setProducts(prodRes.data || prodRes || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu thông số:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // Mở Modal Thêm mới dựa trên loại
    const handleOpenCreate = (type: "group" | "attribute" | "value") => {
        setModalType(type);
        setIsEditMode(false);
        setCurrentId(null);

        if (type === "group") {
            setGroupName("");
            setCategoryId(categories[0]?.id || "");
        } else if (type === "attribute") {
            setLabelSpec("");
            setGroupId(groups[0]?.id || "");
        } else {
            setSpecValue("");
            setProductId(products[0]?.id || "");
            setAttributeId(attributes[0]?.id || "");
        }
        setIsModalOpen(true);
    };

    // Mở Modal Sửa
    const handleOpenEditGroup = (g: SpecGroup) => {
        setModalType("group");
        setIsEditMode(true);
        setCurrentId(g.id);
        setGroupName(g.specificationName);
        setCategoryId(g.categoryId);
        setIsModalOpen(true);
    };

    const handleOpenEditAttr = (a: SpecAttribute) => {
        setModalType("attribute");
        setIsEditMode(true);
        setCurrentId(a.id);
        setLabelSpec(a.labelSpecification);
        setGroupId(a.specificationGroupId);
        setIsModalOpen(true);
    };

    const handleOpenEditValue = (v: SpecValue) => {
        setModalType("value");
        setIsEditMode(true);
        setCurrentId(v.id);
        setSpecValue(v.value);
        setProductId(v.productId);
        setAttributeId(v.specificationAttributeId);
        setIsModalOpen(true);
    };

    // Submit form chung
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token") || "";

        try {
            if (modalType === "group") {
                const payload = { specificationName: groupName, categoryId: Number(categoryId) };
                if (isEditMode && currentId) {
                    await UpdateGroupService(currentId, payload, token);
                    alert("Cập nhật nhóm thông số thành công!");
                } else {
                    await CreateGroupService(payload, token);
                    alert("Thêm mới nhóm thông số thành công!");
                }
            } else if (modalType === "attribute") {
                const payload = { labelSpecification: labelSpec, specificationGroupId: Number(groupId) };
                if (isEditMode && currentId) {
                    await UpdateAttributeService(currentId, payload, token);
                    alert("Cập nhật thuộc tính thành công!");
                } else {
                    await CreateAttributeService(payload, token);
                    alert("Thêm mới thuộc tính thành công!");
                }
            } else {
                const payload = { value: specValue, productId: Number(productId), specificationAttributeId: Number(attributeId) };
                if (isEditMode && currentId) {
                    await UpdateValueService(currentId, payload, token);
                    alert("Cập nhật giá trị thành công!");
                } else {
                    await CreateValueService(payload, token);
                    alert("Thêm mới giá trị thành công!");
                }
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error("Lỗi thực thi:", error);
            alert("Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.");
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý Xóa
    const handleDeleteGroup = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa nhóm thông số này?")) return;
        const token = localStorage.getItem("token") || "";
        try {
            await DeleteGroupService(id, token);
            alert("Xóa thành công!");
            loadData();
        } catch (error) { alert("Xóa thất bại."); }
    };

    const handleDeleteAttr = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa thuộc tính này?")) return;
        const token = localStorage.getItem("token") || "";
        try {
            await DeleteAttributeService(id, token);
            alert("Xóa thành công!");
            loadData();
        } catch (error) { alert("Xóa thất bại."); }
    };

    const handleDeleteValue = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa giá trị thông số này?")) return;
        const token = localStorage.getItem("token") || "";
        try {
            await DeleteValueService(id, token);
            alert("Xóa thành công!");
            loadData();
        } catch (error) { alert("Xóa thất bại."); }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header & Nút bấm động theo Tab */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Quản lý Thông số Kỹ thuật</h1>
                    <p className="text-sm text-gray-500">Cấu hình nhóm, thuộc tính và giá trị chi tiết cho từng sản phẩm</p>
                </div>
                <div className="flex items-center gap-2">
                    {activeTab === "values" && (
                        <button
                            onClick={() => handleOpenCreate("value")}
                            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                        >
                            <MdAdd className="w-5 h-5" /> <span>Thêm Giá trị thông số</span>
                        </button>
                    )}
                    {activeTab === "attributes" && (
                        <button
                            onClick={() => handleOpenCreate("attribute")}
                            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                        >
                            <MdAdd className="w-5 h-5" /> <span>Thêm Thuộc tính mới</span>
                        </button>
                    )}
                    {activeTab === "groups" && (
                        <button
                            onClick={() => handleOpenCreate("group")}
                            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                        >
                            <MdAdd className="w-5 h-5" /> <span>Thêm Nhóm thông số</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Thanh Tab chuyển đổi */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`pb-3 px-6 font-semibold text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${activeTab === "groups" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                >
                    1. Nhóm thông số (SpecificationGroup)
                </button>
                <button
                    onClick={() => setActiveTab("attributes")}
                    className={`pb-3 px-6 font-semibold text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${activeTab === "attributes" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                >
                    2. Thuộc tính (SpecificationAttribute)
                </button>

                <button
                    onClick={() => setActiveTab("values")}
                    className={`pb-3 px-6 font-semibold text-sm transition-colors border-b-2 cursor-pointer whitespace-nowrap ${activeTab === "values" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                >
                    3. Giá trị thông số (SpecificationValue)
                </button>
            </div>

            {/* Hiển thị danh sách bảng dữ liệu */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 text-sm">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {/* TAB 1: BẢNG GIÁ TRỊ THÔNG SỐ */}
                    {activeTab === "values" && (
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-3 px-4">ID</th>
                                            <th className="py-3 px-4">Sản phẩm</th>
                                            <th className="py-3 px-4">Thuộc tính (Label)</th>
                                            <th className="py-3 px-4">Giá trị (Value)</th>
                                            <th className="py-3 px-4 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {values.length > 0 ? (
                                            values.map((v) => (
                                                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-gray-600">#{v.id}</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-800">{v.product?.productName || `ID: ${v.productId}`}</td>
                                                    <td className="py-3 px-4 text-gray-600">{v.specificationAttribute?.labelSpecification || `Attr ID: ${v.specificationAttributeId}`}</td>
                                                    <td className="py-3 px-4 font-semibold text-red-600">{v.value}</td>
                                                    <td className="py-3 px-4 text-right space-x-2">
                                                        <button onClick={() => handleOpenEditValue(v)} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer" title="Sửa"><MdEdit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteValue(v.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer" title="Xóa"><MdDelete className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">Chưa có giá trị thông số nào.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BẢNG THUỘC TÍNH THÔNG SỐ */}
                    {activeTab === "attributes" && (
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-3 px-4">ID</th>
                                            <th className="py-3 px-4">Tên thuộc tính (Label)</th>
                                            <th className="py-3 px-4">Thuộc nhóm thông số</th>
                                            <th className="py-3 px-4 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {attributes.length > 0 ? (
                                            attributes.map((a) => (
                                                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-gray-600">#{a.id}</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-800">{a.labelSpecification}</td>
                                                    <td className="py-3 px-4 text-gray-600">{a.specificationGroup?.specificationName || `Group ID: ${a.specificationGroupId}`}</td>
                                                    <td className="py-3 px-4 text-right space-x-2">
                                                        <button onClick={() => handleOpenEditAttr(a)} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer" title="Sửa"><MdEdit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteAttr(a.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer" title="Xóa"><MdDelete className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">Chưa có thuộc tính nào.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: BẢNG NHÓM THÔNG SỐ */}
                    {activeTab === "groups" && (
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-3 px-4">ID</th>
                                            <th className="py-3 px-4">Tên nhóm thông số</th>
                                            <th className="py-3 px-4">Danh mục áp dụng (Category)</th>
                                            <th className="py-3 px-4 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {groups.length > 0 ? (
                                            groups.map((g) => (
                                                <tr key={g.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-gray-600">#{g.id}</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-800">{g.specificationName}</td>
                                                    <td className="py-3 px-4 text-gray-600">{g.category?.categoryName || `Cat ID: ${g.categoryId}`}</td>
                                                    <td className="py-3 px-4 text-right space-x-2">
                                                        <button onClick={() => handleOpenEditGroup(g)} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer" title="Sửa"><MdEdit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteGroup(g.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer" title="Xóa"><MdDelete className="w-4 h-4" /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">Chưa có nhóm thông số nào.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* MODAL THÊM / SỬA CHUNG */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {modalType === "group" && (isEditMode ? "Cập nhật Nhóm thông số" : "Thêm mới Nhóm thông số")}
                            {modalType === "attribute" && (isEditMode ? "Cập nhật Thuộc tính" : "Thêm mới Thuộc tính")}
                            {modalType === "value" && (isEditMode ? "Cập nhật Giá trị thông số" : "Thêm mới Giá trị thông số")}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* FORM DÀNH CHO GROUP */}
                            {modalType === "group" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm (Specification Name) *</label>
                                        <input
                                            type="text"
                                            required
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            placeholder="Ví dụ: Cấu hình & Bộ nhớ"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thuộc danh mục (Category) *</label>
                                        <select
                                            required
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(Number(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* FORM DÀNH CHO ATTRIBUTE */}
                            {modalType === "attribute" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuộc tính (Label Specification) *</label>
                                        <input
                                            type="text"
                                            required
                                            value={labelSpec}
                                            onChange={(e) => setLabelSpec(e.target.value)}
                                            placeholder="Ví dụ: Chipset, RAM, Kích thước màn hình"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thuộc nhóm thông số (Group) *</label>
                                        <select
                                            required
                                            value={groupId}
                                            onChange={(e) => setGroupId(Number(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">-- Chọn nhóm thông số --</option>
                                            {groups.map((g) => (
                                                <option key={g.id} value={g.id}>{g.specificationName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* FORM DÀNH CHO VALUE */}
                            {modalType === "value" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Chọn sản phẩm *</label>
                                        <select
                                            required
                                            value={productId}
                                            onChange={(e) => setProductId(Number(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>{p.productName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Chọn thuộc tính (Attribute) *</label>
                                        <select
                                            required
                                            value={attributeId}
                                            onChange={(e) => setAttributeId(Number(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">-- Chọn thuộc tính --</option>
                                            {attributes.map((a) => (
                                                <option key={a.id} value={a.id}>{a.labelSpecification}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị thông số (Value) *</label>
                                        <input
                                            type="text"
                                            required
                                            value={specValue}
                                            onChange={(e) => setSpecValue(e.target.value)}
                                            placeholder="Ví dụ: Apple A20 Pro, 6.3 inches..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 shadow-md"
                                >
                                    {submitting ? "Đang lưu..." : "Lưu dữ liệu"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}