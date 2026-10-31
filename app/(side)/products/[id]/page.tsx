"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { GetProductById } from "@/app/Services/ProductService";
import {
    MdStar,
    MdFavoriteBorder,
    MdChatBubbleOutline,
    MdInfoOutline,
    MdCompareArrows,
    MdCheckCircle,
    MdClose,
    MdShoppingCart
} from "react-icons/md";

interface Variant {
    id: number;
    storage: string;
    colorName: string;
    originPrice: number;
    currentPrice: number;
    stock: number;
    urlProductColor?: string;
}

interface Product {
    id: number;
    productName: string;
    description: string;
    urlImageProduct: string;
    isFeatured: boolean;
    isOnPromotion: boolean;
    productVariants: Variant[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = Number(params?.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // State lựa chọn phiên bản & màu sắc
    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [activeVariant, setActiveVariant] = useState<Variant | null>(null);

    // State hiển thị Modal Thông số kỹ thuật
    const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

    // Gọi API lấy chi tiết sản phẩm
    useEffect(() => {
        if (!id) return;
        const fetchProductDetail = async () => {
            try {
                const res = await GetProductById(id)
                const prodData = res.data.data || res.data;
                setProduct(prodData);

                if (prodData.productVariants && prodData.productVariants.length > 0) {
                    const firstVar = prodData.productVariants[0];
                    setSelectedStorage(firstVar.storage);
                    setSelectedColor(firstVar.colorName);
                    setActiveVariant(firstVar);
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    const handleSelectVariant = (storage: string, color: string) => {
        setSelectedStorage(storage);
        setSelectedColor(color);
        const found = product?.productVariants.find(
            v => v.storage === storage && v.colorName === color
        );
        if (found) setActiveVariant(found);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Không tìm thấy sản phẩm.</div>;
    }

    // Lọc ra các dung lượng duy nhất
    const uniqueStorages = Array.from(new Set(product.productVariants?.map(v => v.storage) || []));
    // Lọc ra các màu sắc tương ứng với dung lượng đang chọn
    const availableColorsForStorage = product.productVariants?.filter(v => v.storage === selectedStorage) || [];

    return (
        <div className="bg-gray-100 min-h-screen pb-20 md:pb-10">


            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.productName}</h1>

                </div>


                <div className="flex items-center gap-2 md:gap-4 mb-4 overflow-x-auto pb-2">

                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-red-500 hover:text-red-600 cursor-pointer shrink-0">
                        <MdChatBubbleOutline className="w-4 h-4 text-gray-500" /> Hỏi đáp
                    </button>

                    <button
                        onClick={() => setIsSpecsModalOpen(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-red-500 hover:text-red-600 cursor-pointer shrink-0"
                    >
                        <MdInfoOutline className="w-4 h-4 text-blue-500" /> Thông số
                    </button>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex items-center justify-center relative">
                            <img
                                src={`https://localhost:7276/${product.urlImageProduct}`}
                                alt={product.productName}
                                className="max-h-[350px] object-contain"
                            />
                        </div>

                        {/* Hộp Tính năng nổi bật[cite: 9] */}
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-2xl border border-red-100">
                            <h3 className="font-bold text-red-600 text-sm mb-2 uppercase tracking-wide">Tính năng nổi bật</h3>
                            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.description || "Sản phẩm chính hãng mới nhất, thiết kế sang trọng, hiệu năng mạnh mẽ vượt trội, camera sắc nét hỗ trợ AI tiên tiến."}
                            </p>
                        </div>

                        {/* Cam kết sản phẩm[cite: 9] */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 text-xs text-gray-700">
                            <div className="flex items-start gap-2">
                                <MdCheckCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <span>Mới, đầy đủ phụ kiện từ nhà sản xuất chính hãng.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MdCheckCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <span>1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất.</span>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Giá, Phiên bản, Màu sắc & Khuyến mãi */}
                    <div className="lg:col-span-7 space-y-4">

                        {/* Khối Giá tiền */}
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-wrap items-baseline gap-3">
                            <span className="text-2xl md:text-3xl font-extrabold">
                                {activeVariant ? `${activeVariant.currentPrice?.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                            </span>
                            {activeVariant?.originPrice && activeVariant.originPrice > activeVariant.currentPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {activeVariant.originPrice.toLocaleString("vi-VN")}₫
                                </span>
                            )}
                            <div className="w-full text-xs text-gray-500 mt-1 flex items-center gap-1">
                                Hoặc trả góp chỉ từ <strong className="text-red-600">{(activeVariant?.currentPrice ? activeVariant.currentPrice / 12 : 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}₫</strong> /tháng (18 tháng, lãi suất 0%)[cite: 9]
                            </div>
                        </div>

                        {/* Chọn Phiên bản (Storage)[cite: 9] */}
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Chọn phiên bản dung lượng</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {uniqueStorages.map((storage) => {
                                    const isSelected = selectedStorage === storage;
                                    return (
                                        <button
                                            key={storage}
                                            onClick={() => {
                                                setSelectedStorage(storage);
                                                // Tự động chọn màu đầu tiên của dung lượng đó
                                                const firstColorOfStorage = product.productVariants.find(v => v.storage === storage)?.colorName || "";
                                                handleSelectVariant(storage, firstColorOfStorage);
                                            }}
                                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative ${isSelected
                                                ? "border-red-600 bg-red-50/50 text-red-600 font-bold shadow-xs"
                                                : "border-gray-200 hover:border-gray-400 text-gray-800"
                                                }`}
                                        >
                                            <div className="text-sm">{storage}</div>
                                            {isSelected && (
                                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chọn Màu sắc (Color Variants)[cite: 9] */}
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Chọn màu sắc</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {availableColorsForStorage.map((v) => {
                                    const isSelected = selectedColor === v.colorName;
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => handleSelectVariant(v.storage, v.colorName)}
                                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-left ${isSelected
                                                ? "border-red-600 bg-red-50/50 text-red-600 font-bold"
                                                : "border-gray-200 hover:border-gray-400 text-gray-800"
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg border border-gray-200 p-1 flex items-center justify-center bg-white shrink-0">
                                                <img
                                                    src={v.urlProductColor ? `https://localhost:7276/${v.urlProductColor}` : `https://localhost:7276/${product.urlImageProduct}`}
                                                    alt={v.colorName}
                                                    className="max-h-full object-contain"
                                                />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-xs truncate">{v.colorName}</div>
                                                <div className="text-xs font-bold text-red-600">{v.currentPrice?.toLocaleString("vi-VN")}₫</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Khuyến mãi đi kèm[cite: 9] */}
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 space-y-2.5">
                            <h3 className="font-bold text-red-600 text-xs uppercase tracking-wide">Khuyến mãi đi kèm</h3>
                            <div className="space-y-2 text-xs text-gray-700">
                                <div className="flex items-start gap-2">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                                    <span>Ưu đãi 500K cho Apple Watch Series 12, Ultra 4 khi mua kèm. <strong className="text-red-600 cursor-pointer">Xem chi tiết</strong></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                                    <span>Ưu đãi thanh toán giảm đến 2 triệu. <strong className="text-red-600 cursor-pointer">Xem chi tiết</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Nút Mua ngay / Thêm vào giỏ hàng (Desktop) */}
                        <div className="hidden md:flex gap-3 pt-2">
                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors cursor-pointer text-center">
                                <div className="text-base uppercase">MUA NGAY</div>
                                <div className="text-[10px] font-normal opacity-90">Giao hàng tận nơi hoặc nhận tại cửa hàng</div>
                            </button>
                            <button className="w-20 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl flex flex-col items-center justify-center p-2 transition-colors cursor-pointer">
                                <MdShoppingCart className="w-6 h-6" />
                                <span className="text-[10px] font-semibold mt-1">Thêm giỏ hàng</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* THANH CỐ ĐỊNH DƯỚI CÙNG CHO MOBILE[cite: 9] */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-3 md:hidden z-30 shadow-lg">
                <div>
                    <div className="text-sm font-extrabold text-red-600">
                        {activeVariant ? `${activeVariant.currentPrice?.toLocaleString("vi-VN")}₫` : ""}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                        {selectedStorage} - {selectedColor}
                    </div>
                </div>
                <div className="flex gap-2 flex-1 max-w-[220px]">
                    <button className="flex-1 bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-xs uppercase text-center shadow-md">
                        Mua ngay
                    </button>
                    <button className="p-2 border border-red-200 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <MdShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* MODAL THÔNG SỐ KỸ THUẬT CHI TIẾT[cite: 10] */}
            {isSpecsModalOpen && (
                <div className="fixed inset-0 z-200 flex items-center justify-end bg-black/50 animate-in fade-in duration-200 ">
                    <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

                        <div className="h-14 bg-red-600 text-white flex items-center justify-between px-6 shrink-0">
                            <h2 className="font-bold text-base">Thông số kĩ thuật</h2>
                            <button
                                onClick={() => setIsSpecsModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-red-700 text-white cursor-pointer"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>


                        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-sm">
                            <div>
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Cấu hình & Bộ nhớ[cite: 10]</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Hệ điều hành</span><span className="font-medium text-right">iOS 27</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Chipset</span><span className="font-medium text-right">A20 Pro</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Bộ nhớ trong</span><span className="font-medium text-right">{selectedStorage || "256 GB"}</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">GPU</span><span className="font-medium text-right">GPU 7 lõi</span></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Màn hình[cite: 10]</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Kích thước màn hình</span><span className="font-medium text-right">6.3 inches</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Công nghệ màn hình</span><span className="font-medium text-right">Super Retina XDR</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Tần số quét</span><span className="font-medium text-right">120 Hz</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Độ sáng tối đa</span><span className="font-medium text-right">3000 nits</span></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Camera & Pin</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Camera sau</span><span className="font-medium text-right">3 camera 48MP</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Hỗ trợ sạc nhanh</span><span className="font-medium text-right">Có sạc nhanh</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center shrink-0">
                            <button
                                onClick={() => setIsSpecsModalOpen(false)}
                                className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 rounded-xl text-xs transition-colors cursor-pointer"
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