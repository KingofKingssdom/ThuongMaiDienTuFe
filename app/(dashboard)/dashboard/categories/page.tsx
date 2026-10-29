"use client"
import React, { useState, useEffect } from "react";
import {
    GetAllCategoriesService,
    CreateCategoryService,
    UpdateCategoryService,
    DeleteCategoryService
} from "@/app/Services/CategoryService";
import { MdAdd, MdArrowBack, MdDelete, MdEdit } from "react-icons/md";

interface Category {
    id: number;
    categoryName: string;
    createdDay: string;
}

export default function CategoryAdminPage() {
    const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // State form
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Tải danh sách danh mục
    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await GetAllCategoriesService();
            setCategories(res.data || res || []);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Mở form chỉnh sửa
    const handleOpenEdit = (cat: Category) => {
        setCurrentId(cat.id);
        setCategoryName(cat.categoryName);
        setViewMode("edit");
    };

    // Xử lý Thêm mới hoặc Cập nhật
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token") || "";

        try {
            if (viewMode === "create") {
                await CreateCategoryService({ categoryName }, token);
                alert("Thêm danh mục thành công!");
            } else if (viewMode === "edit" && currentId !== null) {
                await UpdateCategoryService(currentId, { categoryName }, token);
                alert("Cập nhật danh mục thành công!");
            }
            setViewMode("list");
            setCategoryName("");
            setCurrentId(null);
            loadCategories();
        } catch (error) {
            console.error("Lỗi thực thi:", error);
            alert("Thao tác thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    // Xử lý Xóa danh mục
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) return;
        const token = localStorage.getItem("token") || "";

        try {
            await DeleteCategoryService(id, token);
            alert("Xóa danh mục thành công!");
            loadCategories();
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Xóa danh mục thất bại.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Quản lý Danh mục (Category)</h1>
                    <p className="text-sm text-gray-500">Thêm, sửa, xóa và quản lý danh mục sản phẩm</p>
                </div>
                {viewMode === "list" ? (
                    <button
                        onClick={() => { setCategoryName(""); setViewMode("create"); }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5" />
                        <span>Thêm danh mục mới</span>
                    </button>
                ) : (
                    <button
                        onClick={() => { setViewMode("list"); setCategoryName(""); }}
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
                                        <th className="py-3 px-4">Tên danh mục</th>
                                        <th className="py-3 px-4">Ngày tạo</th>
                                        <th className="py-3 px-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-600">#{cat.id}</td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{cat.categoryName}</td>
                                                <td className="py-3 px-4 text-gray-500">
                                                    {new Date(cat.createdDay).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(cat)}
                                                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Sửa"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
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
                                                Chưa có danh mục nào.
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
                        {viewMode === "create" ? "Thêm mới Danh mục" : "Cập nhật Danh mục"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                            <input
                                type="text"
                                required
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Nhập tên danh mục..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? "Đang xử lý..." : (viewMode === "create" ? "Lưu danh mục" : "Cập nhật")}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setViewMode("list"); setCategoryName(""); }}
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