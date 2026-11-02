"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateOrderService, CreateOrderPayload } from "@/app/Services/OrderService";
import { MdArrowBack, MdLocalShipping, MdPayment } from "react-icons/md";
import Link from "next/link";

export default function CheckoutPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Form thông tin nhận hàng
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(1); // 1: Tiền mặt, 2: VNPay Online

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token") || "";

        // Lấy danh sách ID sản phẩm cần thanh toán đã lưu từ giỏ hàng hoặc nút Mua ngay
        const selectedCartItemIds = JSON.parse(localStorage.getItem("checkoutItemIds") || "[]");

        if (selectedCartItemIds.length === 0) {
            alert("Không có sản phẩm nào được chọn để thanh toán!");
            router.push("/cart");
            return;
        }

        const payload: CreateOrderPayload = {
            shippingFee: 0,
            discountAmount: 0,
            paymentMethod: Number(paymentMethod),
            paymentStatus: 0, // 0: Chưa thanh toán / Chờ xử lý
            receiverName,
            receiverPhone,
            receiverAddress,
            note,
            selectedCartItemIds
        };

        try {
            const response = await CreateOrderService(payload, token);
            alert("Tạo đơn hàng thành công!");
            localStorage.removeItem("checkoutItemIds");

            // KIỂM TRA PHƯƠNG THỨC THANH TOÁN
            if (paymentMethod === 2) {
                // Thanh toán Online (VNPay Sandbox)
                // Nếu API trả về đường dẫn URL thanh toán VNPay Sandbox (ví dụ: response.data.paymentUrl)
                const paymentUrl = response.data?.paymentUrl || response.paymentUrl;

                if (paymentUrl) {
                    // Chuyển hướng người dùng sang cổng thanh toán VNPay Sandbox
                    window.location.href = paymentUrl;
                } else {
                    alert("Đã tạo đơn hàng nhưng chưa lấy được đường dẫn thanh toán VNPay!");
                    router.push("/");
                }
            } else {
                // Thanh toán tiền mặt (COD) -> Chuyển hướng về trang chủ hoặc trang thành công
                router.push("/");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            alert("Đặt hàng thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <Link href="/cart" className="p-2 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors">
                        <MdArrowBack className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MdLocalShipping className="text-red-600" /> Thanh toán đơn hàng
                    </h1>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên người nhận *</label>
                            <input
                                type="text"
                                required
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                placeholder="Nhập họ tên..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                            <input
                                type="tel"
                                required
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                placeholder="Nhập số điện thoại..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng *</label>
                        <input
                            type="text"
                            required
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Lưu ý cho người giao hàng..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                            <MdPayment className="text-red-600" /> Chọn phương thức thanh toán
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === 1}
                                    onChange={() => setPaymentMethod(1)}
                                    className="text-red-600"
                                />
                                <span className="text-sm font-medium text-gray-800">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-red-500 transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={paymentMethod === 2}
                                    onChange={() => setPaymentMethod(2)}
                                    className="text-red-600"
                                />
                                <span className="text-sm font-medium text-gray-800">Thanh toán Online (Cổng VNPay Sandbox Test)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm uppercase tracking-wide transition-colors shadow-md cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? "Đang xử lý đơn hàng..." : (paymentMethod === 2 ? "Tiến hành thanh toán VNPay" : "Xác nhận đặt hàng COD")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}