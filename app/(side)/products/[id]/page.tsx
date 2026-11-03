"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GetProductById } from "@/app/Services/ProductService";
import { CreateCartItemService } from "@/app/Services/CartItem";
import {
    MdChatBubbleOutline,
    MdInfoOutline,
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
    const router = useRouter();
    const id = Number(params?.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [activeVariant, setActiveVariant] = useState<Variant | null>(null);

    const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

    const checkAuthAndGetToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập để tiếp tục!");
            router.push("/login");
            return null;
        }
        return token;
    };
    useEffect(() => {
        if (!id) return;
        const fetchProductDetail = async () => {
            try {
                const res = await GetProductById(id);
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

    const handleAddToCart = async () => {
        if (!activeVariant) {
            alert("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        const token = checkAuthAndGetToken();
        if (!token) return; // Nếu chưa đăng nhập sẽ dừng lại và chuyển trang

        setSubmitting(true);
        try {
            await CreateCartItemService(
                {
                    productVariantId: activeVariant.id,
                    quantity: 1
                },
                token
            );
            alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
        } catch (error) {
            console.error("Lỗi thêm vào giỏ hàng:", error);
            alert("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };


    const handleBuyNow = async () => {
        if (!activeVariant) {
            alert("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        const token = checkAuthAndGetToken();
        if (!token) return; // Nếu chưa đăng nhập sẽ dừng lại và chuyển trang

        setSubmitting(true);
        try {
            const res = await CreateCartItemService(
                {
                    productVariantId: activeVariant.id,
                    quantity: 1
                },
                token
            );

            const cartItemId = res.data?.id || res.id;

            if (cartItemId) {
                localStorage.setItem("checkoutItemIds", JSON.stringify([cartItemId]));
            }
            router.push("/checkout");
        } catch (error) {
            console.error("Lỗi Mua ngay:", error);
            alert("Không thể thực hiện mua ngay. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Không tìm thấy sản phẩm.</div>;
    }

    const uniqueStorages = Array.from(new Set(product.productVariants?.map(v => v.storage) || []));
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

                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-2xl border border-red-100">
                            <h3 className="font-bold text-red-600 text-sm mb-2 uppercase tracking-wide">Tính năng nổi bật</h3>
                            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.description || "Sản phẩm chính hãng mới nhất, thiết kế sang trọng, hiệu năng mạnh mẽ vượt trội."}
                            </p>
                        </div>

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


                    <div className="lg:col-span-7 space-y-4">

                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-wrap items-baseline gap-3">
                            <span className="text-2xl md:text-3xl font-extrabold text-red-600">
                                {activeVariant ? `${activeVariant.currentPrice?.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                            </span>
                            {activeVariant?.originPrice && activeVariant.originPrice > activeVariant.currentPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    {activeVariant.originPrice.toLocaleString("vi-VN")}₫
                                </span>
                            )}
                        </div>


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


                        <div className="hidden md:flex gap-3 pt-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={submitting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors cursor-pointer text-center disabled:opacity-50"
                            >
                                <div className="text-base uppercase">{submitting ? "Đang xử lý..." : "MUA NGAY"}</div>
                                <div className="text-[10px] font-normal opacity-90">Thanh toán nhanh chóng, tiện lợi</div>
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={submitting}
                                className="w-20 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl flex flex-col items-center justify-center p-2 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <MdShoppingCart className="w-6 h-6" />
                                <span className="text-[10px] font-semibold mt-1">Thêm giỏ</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>


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
                    <button
                        onClick={handleBuyNow}
                        disabled={submitting}
                        className="flex-1 bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-xs uppercase text-center shadow-md disabled:opacity-50"
                    >
                        Mua ngay
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={submitting}
                        className="p-2 border border-red-200 bg-red-50 text-red-600 rounded-xl flex items-center justify-center disabled:opacity-50"
                    >
                        <MdShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>


            {isSpecsModalOpen && (
                <div className="fixed inset-0 z-120 flex items-center justify-end bg-black/50 animate-in fade-in duration-200">
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
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Cấu hình & Bộ nhớ</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Bộ nhớ trong</span><span className="font-medium text-right">{selectedStorage || "N/A"}</span></div>
                                    <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-500">Màu sắc</span><span className="font-medium text-right">{selectedColor || "N/A"}</span></div>
                                </div>
                            </div>
                        </div>

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