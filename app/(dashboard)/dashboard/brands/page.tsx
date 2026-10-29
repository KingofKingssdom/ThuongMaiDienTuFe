"use client"
import React, { useState, useEffect } from "react";
import {
    GetAllBrandsService,
    CreateBrandService,
    UpdateBrandService,
    DeleteBrandService
} from "@/app/Services/BrandService";
import { MdAdd, MdArrowBack, MdDelete, MdEdit } from "react-icons/md";

interface Brand {
    id: number;
    brandName: string;
    urlImageBrand: string;
}

export default function BrandAdminPage() {
    const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);

    // State form
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [brandName, setBrandName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Tải danh sách thương hiệu
    const loadBrands = async () => {
        setLoading(true);
        try {
            const res = await GetAllBrandsService();
            setBrands(res.data || res || []);
        } catch (error) {
            console.error("Lỗi tải thương hiệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    // Mở form chỉnh sửa
    const handleOpenEdit = (b: Brand) => {
        setCurrentId(b.id);
        setBrandName(b.brandName);
        setImageFile(null);
        setViewMode("edit");
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token") || "";

        const formData = new FormData();
        formData.append("BrandName", brandName);
        if (imageFile) {
            formData.append("UrlImageBrand", imageFile);
        }

        try {
            if (viewMode === "create") {
                await CreateBrandService(formData, token);
                alert("Thêm thương hiệu thành công!");
            } else if (viewMode === "edit" && currentId !== null) {
                await UpdateBrandService(currentId, formData, token);
                alert("Cập nhật thương hiệu thành công!");
            }
            setViewMode("list");
            setBrandName("");
            setImageFile(null);
            setCurrentId(null);
            loadBrands();
        } catch (error) {
            console.error("Lỗi thực thi:", error);
            alert("Thao tác thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý Xóa thương hiệu
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa thương hiệu này không?")) return;
        const token = localStorage.getItem("token") || "";

        try {
            await DeleteBrandService(id, token);
            alert("Xóa thương hiệu thành công!");
            loadBrands();
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Xóa thương hiệu thất bại.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Quản lý Thương hiệu (Brand)</h1>
                    <p className="text-sm text-gray-500">Thêm, sửa, xóa và quản lý các thương hiệu sản phẩm</p>
                </div>
                {viewMode === "list" ? (
                    <button
                        onClick={() => { setBrandName(""); setImageFile(null); setViewMode("create"); }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5" />
                        <span>Thêm thương hiệu mới</span>
                    </button>
                ) : (
                    <button
                        onClick={() => { setViewMode("list"); setBrandName(""); setImageFile(null); }}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                    >
                        <MdArrowBack className="w-5 h-5" />
                        <span>Quay lại danh sách</span>
                    </button>
                )}
            </div>

            {/* HIỂN THỊ DANH SÁCH */}
            {viewMode === "list" && (
                <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 text-sm">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Logo</th>
                                        <th className="py-3 px-4">Tên thương hiệu</th>
                                        <th className="py-3 px-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {brands.length > 0 ? (
                                        brands.map((b) => (
                                            <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-600">#{b.id}</td>
                                                <td className="py-3 px-4">
                                                    <div className="w-16 h-10 rounded-lg border border-gray-100 p-1 flex items-center justify-center bg-white">
                                                        <img
                                                            src={`https://localhost:7276/${b.urlImageBrand}`}
                                                            alt={b.brandName}
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{b.brandName}</td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(b)}
                                                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Sửa"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Xóa"
                                                    >
                                                        <MdDelete className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-400 text-sm">
                                                Chưa có thương hiệu nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* FORM THÊM MỚI / CẬP NHẬT */}
            {(viewMode === "create" || viewMode === "edit") && (
                <div className="max-w-xl bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {viewMode === "create" ? "Thêm mới Thương hiệu" : "Cập nhật Thương hiệu"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu *</label>
                            <input
                                type="text"
                                required
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="Nhập tên thương hiệu..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh Logo {viewMode === "create" ? "*" : "(Để trống nếu không đổi)"}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...(viewMode === "create" ? { required: true } : {})}
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? "Đang xử lý..." : (viewMode === "create" ? "Lưu thương hiệu" : "Cập nhật")}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setViewMode("list"); setBrandName(""); setImageFile(null); }}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}