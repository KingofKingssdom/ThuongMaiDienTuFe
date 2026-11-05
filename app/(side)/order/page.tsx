"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GetOrdersService } from "@/app/Services/OrderService";
import { MdShoppingBag, MdArrowBack, MdPerson, MdPhone, MdLocationOn } from "react-icons/md";

interface OrderItem {
    orderId: number;
    productVariantId: number;
    productName: string;
    storage: string;
    colorName: string;
    urlProductColor: string;
    quantity: number;
    priceAtTime: number;
    totalPrice: number;
}

interface Order {
    id: number;
    orderCode: string;
    orderStatus: number;
    subTotal: number;
    shippingFee: number;
    discountAmount: number;
    grandTotal: number;
    paymentMethod: number; // 1: COD, 2: Online (VNPay)
    paymentStatus: number; // 0: Chưa thanh toán, 1: Đã thanh toán
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    note: string;
    orderItems: OrderItem[];
}

export default function OrdersPage() {
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        try {
            const res = await GetOrdersService(token);
            const data = res.data || res || [];
            setOrders(data);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    const getOrderStatusText = (status: number) => {
        switch (status) {
            case 1: return { text: "Chờ xác nhận", color: "bg-amber-50 text-amber-600 border-amber-200" };
            case 2: return { text: "Đang giao hàng", color: "bg-blue-50 text-blue-600 border-blue-200" };
            case 3: return { text: "Đã hoàn thành", color: "bg-green-50 text-green-600 border-green-200" };
            case 4: return { text: "Đã hủy", color: "bg-red-50 text-red-600 border-red-200" };
            default: return { text: "Đang xử lý", color: "bg-gray-50 text-gray-600 border-gray-200" };
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải danh sách đơn hàng...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                            <MdArrowBack className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MdShoppingBag className="text-red-600" /> Lịch sử đơn hàng của bạn
                        </h1>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-xs border border-gray-200 space-y-4">
                        <div className="text-gray-400 text-base">Bạn chưa có đơn hàng nào.</div>
                        <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md">
                            Khám phá sản phẩm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusInfo = getOrderStatusText(order.orderStatus);

                            return (
                                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200 space-y-4">

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase font-semibold">Mã đơn hàng:</span>
                                            <span className="ml-2 font-bold text-gray-900">{order.orderCode}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${order.paymentStatus === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"}`}>
                                                {order.paymentStatus === 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="divide-y divide-gray-100">
                                        {order.orderItems && order.orderItems.map((item, index) => (
                                            <div key={index} className="py-3 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 rounded-xl border border-gray-100 p-1 flex items-center justify-center bg-gray-50 shrink-0">
                                                        <img
                                                            src={item.urlProductColor ? `${imageBaseUrl}/${item.urlProductColor}` : "https://via.placeholder.com/150"}
                                                            alt={item.productName || "Sản phẩm"}
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm">{item.productName || "Sản phẩm chính hãng"}</h4>
                                                        <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                                                            {item.storage && <span className="bg-gray-100 px-2 py-0.5 rounded">Bản: {item.storage}</span>}
                                                            {item.colorName && <span className="bg-gray-100 px-2 py-0.5 rounded">Màu: {item.colorName}</span>}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Số lượng: <span className="font-semibold text-gray-800">{item.quantity}</span> x <span className="text-red-600 font-bold">{item.priceAtTime.toLocaleString("vi-VN")}₫</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right font-extrabold text-gray-900 text-sm">
                                                    {item.totalPrice.toLocaleString("vi-VN")}₫
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 font-medium text-gray-800">
                                                <MdPerson className="text-gray-400 w-4 h-4" /> <span>{order.receiverName}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MdPhone className="text-gray-400 w-4 h-4" /> <span>{order.receiverPhone}</span>
                                            </div>
                                            <div className="flex items-start gap-1.5">
                                                <MdLocationOn className="text-gray-400 w-4 h-4 shrink-0 mt-0.5" /> <span>{order.receiverAddress}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 md:text-right">
                                            <div>
                                                <span className="text-gray-500">Phương thức thanh toán: </span>
                                                <span className="font-semibold text-gray-800">
                                                    {order.paymentMethod === 1 ? "Tiền mặt khi nhận hàng (COD)" : "Thanh toán Online (VNPay)"}
                                                </span>
                                            </div>
                                            {order.note && (
                                                <div>
                                                    <span className="text-gray-500">Ghi chú: </span>
                                                    <span className="italic text-gray-700">"{order.note}"</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Phí vận chuyển: <span className="font-medium text-gray-800">{order.shippingFee.toLocaleString("vi-VN")}₫</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs text-gray-500">Thành tiền:</span>
                                            <span className="text-lg font-extrabold text-red-600">
                                                {order.grandTotal.toLocaleString("vi-VN")}₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}