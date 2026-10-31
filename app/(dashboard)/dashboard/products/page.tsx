"use client"
import React, { useState, useEffect } from "react";
import {
    GetAllProductService,
    CreateProductService,
    UpdateProductService,
    DeleteProductService,
    GetVariantsByProductIdService
} from "@/app/Services/ProductService";
import { GetAllBrandsService } from "@/app/Services/BrandService";
import { GetAllCategoriesService } from "@/app/Services/CategoryService";
import { MdAdd, MdArrowBack, MdDelete, MdEdit, MdLayers, MdClose } from "react-icons/md";

interface Brand {
    id: number;
    brandName: string;
}

interface Category {
    id: number;
    categoryName: string;
}

interface ProductVariant {
    id: number;
    storage: string;
    originPrice: number;
    currentPrice: number;
    stock: number;
    colorName: string;
}

interface Product {
    id: number;
    productName: string;
    description: string;
    urlImageProduct: string;
    isFeatured: boolean;
    isOnPromotion: boolean;
    category?: Category;
    brand?: Brand;
}

export default function ProductAdminPage() {
    const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // State cho form thêm/sửa
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [isFeatured, setIsFeatured] = useState(true);
    const [isOnPromotion, setIsOnPromotion] = useState(true);
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // State cho Modal xem biến thể sản phẩm
    const [selectedProductVariants, setSelectedProductVariants] = useState<ProductVariant[] | null>(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

    // Tải danh sách sản phẩm, brands và categories đồng thời
    const loadData = async () => {
        setLoading(true);
        try {
            const [prodRes, brandRes, catRes] = await Promise.all([
                GetAllProductService(),
                GetAllBrandsService(),
                GetAllCategoriesService()
            ]);

            setProducts(prodRes.data || prodRes || []);
            setBrands(brandRes.data || brandRes || []);
            setCategories(catRes.data || catRes || []);
        } catch (error) {
            alert("Không thể tải dữ liệu từ hệ thống.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Reset form
    const resetForm = () => {
        setProductName("");
        setDescription("");
        setIsFeatured(true);
        setIsOnPromotion(true);
        setBrandId("");
        setCategoryId("");
        setImageFile(null);
        setCurrentId(null);
    };

    // Mở form chỉnh sửa (Lấy ID từ object category và brand trả về từ backend)
    const handleOpenEdit = (p: Product) => {
        setCurrentId(p.id);
        setProductName(p.productName);
        setDescription(p.description || "");
        setIsFeatured(p.isFeatured);
        setIsOnPromotion(p.isOnPromotion);
        setBrandId(p.brand?.id ? String(p.brand.id) : "");
        setCategoryId(p.category?.id ? String(p.category.id) : "");
        setImageFile(null);
        setViewMode("edit");
    };

    // Xử lý Thêm mới hoặc Cập nhật
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token") || "";

        const formData = new FormData();
        formData.append("ProductName", productName);
        formData.append("Description", description || "");
        formData.append("IsFeatured", String(isFeatured));
        formData.append("IsOnPromotion", String(isOnPromotion));
        formData.append("BrandId", brandId);
        formData.append("CategoryId", categoryId);
        if (imageFile) {
            formData.append("UrlImageProduct", imageFile);
        }

        try {
            if (viewMode === "create") {
                await CreateProductService(formData, token);
                alert("Thêm sản phẩm thành công!");
            } else if (viewMode === "edit" && currentId !== null) {
                await UpdateProductService(currentId, formData, token);
                alert("Cập nhật sản phẩm thành công!");
            }
            setViewMode("list");
            resetForm();
            loadData();
        } catch (error) {
            alert("Thực thi thất bại. Vui lòng kiểm tra lại.");
        }
    };

    // Xử lý Xóa sản phẩm
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
        const token = localStorage.getItem("token") || "";

        try {
            await DeleteProductService(id, token);
            alert("Xóa sản phẩm thành công!");
            loadData();
        } catch (error) {
            alert("Xóa sản phẩm thất bại.");
        }
    };

    // Xem danh sách biến thể của sản phẩm
    const handleViewVariants = async (productId: number) => {
        try {
            const res = await GetVariantsByProductIdService(productId);
            setSelectedProductVariants(res.data || res || []);
            setIsVariantModalOpen(true);
        } catch (error) {
            alert("Sản phẩm này chưa có biến thể nào.");
            setSelectedProductVariants([]);
            setIsVariantModalOpen(true);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500">Thêm, sửa, xóa và xem biến thể sản phẩm</p>
                </div>
                {viewMode === "list" ? (
                    <button
                        onClick={() => { resetForm(); setViewMode("create"); }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                        <MdAdd className="w-5 h-5" />
                        <span>Thêm sản phẩm mới</span>
                    </button>
                ) : (
                    <button
                        onClick={() => { setViewMode("list"); resetForm(); }}
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
                                        <th className="py-3 px-4">Ảnh</th>
                                        <th className="py-3 px-4">Tên sản phẩm</th>
                                        <th className="py-3 px-4">Thương hiệu</th>
                                        <th className="py-3 px-4">Danh mục</th>
                                        <th className="py-3 px-4 text-center">Biến thể</th>
                                        <th className="py-3 px-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {products.length > 0 ? (
                                        products.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-gray-600">#{p.id}</td>
                                                <td className="py-3 px-4">
                                                    <div className="w-12 h-12 rounded-lg border border-gray-100 p-1 flex items-center justify-center bg-white">
                                                        <img
                                                            src={`https://localhost:7276/${p.urlImageProduct}`}
                                                            alt={p.productName}
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{p.productName}</td>
                                                {/* Hiển thị brandName từ object brand */}
                                                <td className="py-3 px-4 text-gray-600 font-medium">
                                                    {p.brand?.brandName || <span className="text-gray-300">Chưa có</span>}
                                                </td>
                                                {/* Hiển thị categoryName từ object category */}
                                                <td className="py-3 px-4 text-gray-600 font-medium">
                                                    {p.category?.categoryName || <span className="text-gray-300">Chưa có</span>}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => handleViewVariants(p.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                    >
                                                        <MdLayers className="w-4 h-4" />
                                                        <span>Xem biến thể</span>
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(p)}
                                                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Sửa sản phẩm"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <MdDelete className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                                                Chưa có sản phẩm nào.
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
                <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {viewMode === "create" ? "Thêm mới Sản phẩm" : "Cập nhật Sản phẩm"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                            <input
                                type="text"
                                required
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Nhập tên sản phẩm..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhập mô tả sản phẩm..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm *</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...(viewMode === "create" ? { required: true } : {})}
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            />
                        </div>

                        {/* DROPDOWN CHỌN BRAND VÀ CATEGORY */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu (Brand) *</label>
                                <select
                                    required
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục (Category) *</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded border-gray-300"
                                />
                                Sản phẩm nổi bật
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isOnPromotion}
                                    onChange={(e) => setIsOnPromotion(e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded border-gray-300"
                                />
                                Đang khuyến mãi
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                            >
                                {viewMode === "create" ? "Lưu sản phẩm" : "Cập nhật sản phẩm"}
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

            {/* MODAL HIỂN THỊ DANH SÁCH BIẾN THỂ */}
            {isVariantModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Danh sách biến thể sản phẩm</h3>
                            <button
                                onClick={() => setIsVariantModalOpen(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {selectedProductVariants && selectedProductVariants.length > 0 ? (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                            <th className="py-2.5 px-3">ID</th>
                                            <th className="py-2.5 px-3">Dung lượng</th>
                                            <th className="py-2.5 px-3">Màu sắc</th>
                                            <th className="py-2.5 px-3">Giá bán</th>
                                            <th className="py-2.5 px-3">Kho</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedProductVariants.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50">
                                                <td className="py-2.5 px-3">#{v.id}</td>
                                                <td className="py-2.5 px-3 font-medium">{v.storage || "N/A"}</td>
                                                <td className="py-2.5 px-3">{v.colorName || "N/A"}</td>
                                                <td className="py-2.5 px-3 text-red-600 font-bold">{v.currentPrice?.toLocaleString("vi-VN")}₫</td>
                                                <td className="py-2.5 px-3">{v.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Sản phẩm này hiện chưa có biến thể nào.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setIsVariantModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}