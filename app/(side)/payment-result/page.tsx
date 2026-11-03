"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { MdCheckCircle, MdError, MdShoppingBag } from "react-icons/md";

export default function PaymentResultPage() {
    const searchParams = useSearchParams();
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState("Đang xử lý kết quả thanh toán với hệ thống...");

    useEffect(() => {
        const verifyPayment = async () => {
            const responseCode = searchParams.get("vnp_ResponseCode");
            const orderId = searchParams.get("vnp_TxnRef") || searchParams.get("orderId");

            if (responseCode === "00") {
                setIsSuccess(true);
                setMessage("Thanh toán đơn hàng thành công!");


                try {
                    const token = localStorage.getItem("token") || "";

                    const queryString = window.location.search;
                    await axios.get(`https://localhost:7276/api/payment/result-vnpay${queryString}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Đã cập nhật trạng thái thanh toán thành công vào DB!");
                } catch (error) {
                    console.error("Lỗi cập nhật trạng thái thanh toán:", error);
                }

            } else if (responseCode) {
                setIsSuccess(false);
                setMessage("Thanh toán thất bại hoặc đã bị hủy.");
            } else {
                setIsSuccess(false);
                setMessage("Không tìm thấy thông tin phản hồi từ cổng thanh toán.");
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-lg border border-gray-200 text-center space-y-6">
                {isSuccess === null ? (
                    <div className="text-gray-500 py-6">Đang kiểm tra giao dịch...</div>
                ) : isSuccess ? (
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <MdCheckCircle className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h1>
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <MdError className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Thanh toán thất bại</h1>
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                )}

                <div className="pt-4 flex flex-col gap-3">
                    <Link
                        href="/order"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                        <MdShoppingBag className="w-5 h-5" /> Xem lịch sử đơn hàng
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}