"use client"
import React, { useState, useEffect } from "react";
import {
    GetAllVariantsService,
    GetVariantsByProductIdService,
    CreateVariantService,
    UpdateVariantService,
    DeleteVariantService
} from "@/app/Services/ProductVariantService";
import { GetAllProductService } from "@/app/Services/ProductService";
import { MdAdd, MdArrowBack, MdDelete, MdEdit } from "react-icons/md";

interface Product {
    id: number;
    productName: string;
}

interface ProductVariant {
    id: number;
    storage: string;
    originPrice: number;
    currentPrice: number;
    stock: number;
    colorName: string;
    urlProductColor?: string;
    productId: number;
}

export default function VariantAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");

    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");

    // State form biến thể
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [storage, setStorage] = useState("");
    const [originPrice, setOriginPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [stock, setStock] = useState("");
    const [colorName, setColorName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 1. Tải danh sách Product để người dùng chọn
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await GetAllProductService();
                const list = res.data || res || [];
                setProducts(list);
                if (list.length > 0) {
                    setSelectedProductId(list[0].id); // Mặc định chọn sản phẩm đầu tiên
                }
            } catch (error) {
                console.error("Lỗi tải danh sách sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    // 2. Tải danh sách biến thể mỗi khi `selectedProductId` thay đổi
    const loadVariants = async (prodId: number) => {
        setLoading(true);
        try {
            const res = await GetVariantsByProductIdService(prodId);
            setVariants(res.data || res || []);
        } catch (error) {
            console.error("Lỗi tải biến thể:", error);
            setVariants([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedProductId !== "") {
            loadVariants(Number(selectedProductId));
        }
    }, [selectedProductId]);

    // Reset form
    const resetForm = () => {
        setStorage("");
        setOriginPrice("");
        setCurrentPrice("");
        setStock("");
        setColorName("");
        setImageFile(null);
        setCurrentId(null);
    };

    // Mở form sửa
    const handleOpenEdit = (v: ProductVariant) => {
        setCurrentId(v.id);
        setStorage(v.storage || "");
        setOriginPrice(String(v.originPrice || ""));
        setCurrentPrice(String(v.currentPrice || ""));
        setStock(String(v.stock || ""));
        setColorName(v.colorName || "");
        setImageFile(null);
        setViewMode("edit");
    };

    // Xử lý Thêm mới / Cập nhật
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId) {
            alert("Vui lòng chọn sản phẩm trước khi thêm biến thể!");
            return;
        }

        setSubmitting(true);
        const token = localStorage.getItem("token") || "";

        const formData = new FormData();
        formData.append("Storage", storage);
        formData.append("OriginPrice", originPrice);
        formData.append("CurrentPrice", currentPrice);
        formData.append("Stock", stock);
        formData.append("ColorName", colorName);
        formData.append("ProductId", String(selectedProductId));
        if (imageFile) {
            formData.append("UrlProductColor", imageFile);
        }

        try {
            if (viewMode === "create") {
                await CreateVariantService(formData, token);
                alert("Thêm biến thể thành công!");
            } else if (viewMode === "edit" && currentId !== null) {
                await UpdateVariantService(currentId, formData, token);
                alert("Cập nhật biến thể thành công!");
            }
            setViewMode("list");
            resetForm();
            loadVariants(Number(selectedProductId));
        } catch (error) {
            console.error("Lỗi thực thi:", error);
            alert("Thao tác thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    // Xóa biến thể
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;
        const token = localStorage.getItem("token") || "";

        try {
            await DeleteVariantService(id, token);
            alert("Xóa biến thể thành công!");
            loadVariants(Number(selectedProductId));
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Xóa biến thể thất bại.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header & Thanh chọn Sản phẩm */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Quản lý Biến thể sản phẩm</h1>
                    <p className="text-sm text-gray-500">Chọn sản phẩm để xem và quản lý các phiên bản cấu hình</p>
                </div>

                {viewMode === "list" && (
                    <div className="flex items-center gap-3">
                        {/* Dropdown chọn Product */}
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(Number(e.target.value))}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer"
                        >
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    [ID: {p.id}] {p.productName}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => { resetForm(); setViewMode("create"); }}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer shrink-0"
                        >
                            <MdAdd className="w-5 h-5" />
                            <span>Thêm biến thể</span>
                        </button>
                    </div>
                )}

                {viewMode !== "list" && (
                    <button
                        onClick={() => { setViewMode("list"); resetForm(); }}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer self-start"
                    >
                        <MdArrowBack className="w-5 h-5" />
                        <span>Quay lại danh sách</span>
                    </button>
                )}
            </div>

            {/* HIỂN THỊ DANH SÁCH BIẾN THỂ */}
            {viewMode === "list" && (
                <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 text-sm">Đang tải biến thể...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Ảnh màu</th>
                                        <th className="py-3 px-4">Dung lượng</th>
                                        <th className="py-3 px-4">Màu sắc</th>
                                        <th className="py-3 px-4">Giá gốc</th>
                                        <th className="py-3 px-4">Giá bán</th>
                                        <th className="py-3 px-4">Tồn kho</th>
                                        <th className="py-3 px-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {variants.length > 0 ? (
                                        variants.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-600">#{v.id}</td>
                                                <td className="py-3 px-4">
                                                    {v.urlProductColor ? (
                                                        <div className="w-12 h-10 rounded-lg border border-gray-100 p-1 flex items-center justify-center bg-white">
                                                            <img
                                                                src={`https://localhost:7276/${v.urlProductColor}`}
                                                                alt={v.colorName}
                                                                className="max-h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Không có</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{v.storage || "N/A"}</td>
                                                <td className="py-3 px-4 text-gray-600">{v.colorName || "N/A"}</td>
                                                <td className="py-3 px-4 text-gray-400 line-through">
                                                    {v.originPrice ? `${v.originPrice.toLocaleString("vi-VN")}₫` : "0₫"}
                                                </td>
                                                <td className="py-3 px-4 text-red-600 font-bold">
                                                    {v.currentPrice ? `${v.currentPrice.toLocaleString("vi-VN")}₫` : "0₫"}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-700">{v.stock}</td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(v)}
                                                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Sửa"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v.id)}
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
                                            <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                                                Sản phẩm này chưa có biến thể nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* FORM THÊM MỚI / CẬP NHẬT BIẾN THỂ */}
            {(viewMode === "create" || viewMode === "edit") && (
                <div className="max-w-xl bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {viewMode === "create" ? "Thêm mới Biến thể sản phẩm" : "Cập nhật Biến thể"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng (Storage)</label>
                                <input
                                    type="text"
                                    value={storage}
                                    onChange={(e) => setStorage(e.target.value)}
                                    placeholder="Ví dụ: 256GB"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên màu (ColorName)</label>
                                <input
                                    type="text"
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
                                    placeholder="Ví dụ: Titan Tự Nhiên"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (OriginPrice)</label>
                                <input
                                    type="number"
                                    value={originPrice}
                                    onChange={(e) => setOriginPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (CurrentPrice)</label>
                                <input
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho (Stock)</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh màu sắc (UrlProductColor)</label>
                            <input
                                type="file"
                                accept="image/*"
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
                                {submitting ? "Đang xử lý..." : (viewMode === "create" ? "Lưu biến thể" : "Cập nhật")}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setViewMode("list"); resetForm(); }}
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