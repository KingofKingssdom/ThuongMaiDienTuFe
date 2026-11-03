"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GetCartService } from "@/app/Services/CartItem";
import { MdDelete, MdShoppingBag, MdArrowBack } from "react-icons/md";

interface CartItem {
    id: number;
    quantity: number;
    priceAtTime: number;
    totalPrice: number;
    productVariant?: {
        id: number;
        storage: string;
        colorName: string;
        currentPrice: number;
        urlProductColor?: string;
        productName: string;
    };
}

export default function Cart() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);


    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);


    const fetchCart = async () => {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        try {
            const res = await GetCartService(token);
            const data = res.data || res || [];
            setCartItems(data);

            setSelectedItemIds(data.map((item: CartItem) => item.id));
        } catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);


    const handleToggleSelectOne = (id: number) => {
        if (selectedItemIds.includes(id)) {
            setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
        } else {
            setSelectedItemIds([...selectedItemIds, id]);
        }
    };


    const handleToggleSelectAll = () => {
        if (selectedItemIds.length === cartItems.length) {
            setSelectedItemIds([]); // Bỏ chọn hết
        } else {
            setSelectedItemIds(cartItems.map(item => item.id)); // Chọn tất cả
        }
    };


    const handleDeleteItem = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
        try {

            alert("Đã xóa sản phẩm!");

            setCartItems(cartItems.filter(item => item.id !== id));
            setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            alert("Xóa thất bại.");
        }
    };


    const totalPrice = cartItems
        .filter(item => selectedItemIds.includes(item.id))
        .reduce((sum, item) => {
            return sum + (item.totalPrice || (item.priceAtTime * item.quantity));
        }, 0);


    const handleProceedToCheckout = () => {
        if (selectedItemIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }


        localStorage.setItem("checkoutItemIds", JSON.stringify(selectedItemIds));


        router.push("/checkout");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải giỏ hàng...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                            <MdArrowBack className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MdShoppingBag className="text-red-600" /> Giỏ hàng của bạn ({cartItems.length})
                        </h1>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-xs border border-gray-200 space-y-4">
                        <div className="text-gray-400 text-base">Giỏ hàng của bạn đang trống.</div>
                        <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        <div className="lg:col-span-8 space-y-3">

                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center gap-3 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={cartItems.length > 0 && selectedItemIds.length === cartItems.length}
                                    onChange={handleToggleSelectAll}
                                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-550 cursor-pointer"
                                />
                                <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
                            </div>

                            {cartItems.map((item) => {
                                const variant = item.productVariant;
                                const imageUrl = variant?.urlProductColor;
                                const isChecked = selectedItemIds.includes(item.id);

                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 w-full sm:w-auto">

                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleSelectOne(item.id)}
                                                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer shrink-0"
                                            />
                                            <div className="w-20 h-20 rounded-xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 shrink-0">
                                                <img
                                                    src={imageUrl ? `https://localhost:7276/${imageUrl}` : "https://via.placeholder.com/150"}
                                                    alt={variant?.productName || "Sản phẩm"}
                                                    className="max-h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm md:text-base">{variant?.productName || "Sản phẩm"}</h3>
                                                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                                    {variant?.storage && <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">Bản: {variant.storage}</span>}
                                                    {variant?.colorName && <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">Màu: {variant.colorName}</span>}
                                                </div>
                                                <div className="text-sm font-extrabold text-red-600 mt-1.5">
                                                    {item.priceAtTime?.toLocaleString("vi-VN")}₫
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                                            <div className="text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                                                Số lượng: <span className="font-bold text-gray-900">{item.quantity}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                                                title="Xóa sản phẩm"
                                            >
                                                <MdDelete className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                        <div className="lg:col-span-4">
                            <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 space-y-4 sticky top-4">
                                <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Thông tin đơn hàng</h3>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Đã chọn ({selectedItemIds.length} sản phẩm):</span>
                                    <span className="font-semibold text-gray-900">{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>

                                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                                    <span className="font-bold text-gray-900 text-base">Tổng tiền:</span>
                                    <span className="font-extrabold text-xl text-red-600">{totalPrice.toLocaleString("vi-VN")}₫</span>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md cursor-pointer text-center uppercase tracking-wide"
                                >
                                    Tiến hành thanh toán ({selectedItemIds.length})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}