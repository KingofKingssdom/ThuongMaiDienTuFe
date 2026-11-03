"use client"
import { useState, useEffect } from "react";
import { GetDashboardStatsService } from "@/app/Services/DashboardService";
import { MdAttachMoney, MdShoppingBag, MdInventory2, MdGroup } from "react-icons/md";

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token") || "";
            try {
                const res = await GetDashboardStatsService(token);
                const data = res.data || res;
                setStats(data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-gray-500">Đang tải số liệu tổng quan...</div>;
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Chào mừng bạn đến trang Quản trị</h1>
                <p className="text-sm text-gray-500 mt-1">Tổng quan các chỉ số hoạt động của hệ thống Thương mại Điện tử.</p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <MdAttachMoney className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Tổng doanh thu</div>
                        <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                            {stats.totalRevenue.toLocaleString("vi-VN")}₫
                        </div>
                    </div>
                </div>


                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MdShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Tổng đơn hàng</div>
                        <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                            {stats.totalOrders}
                        </div>
                    </div>
                </div>


                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <MdInventory2 className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Tổng sản phẩm</div>
                        <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                            {stats.totalProducts}
                        </div>
                    </div>
                </div>


                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <MdGroup className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Khách hàng</div>
                        <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                            {stats.totalUsers}
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">QUẢN LÝ</h3>
                    <p className="text-base font-bold text-red-600">Sản phẩm & Biến thể</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">QUẢN LÝ</h3>
                    <p className="text-base font-bold text-red-600">Thương hiệu (Brand)</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">QUẢN LÝ</h3>
                    <p className="text-base font-bold text-red-600">Danh mục (Category)</p>
                </div>
            </div>
        </div>
    );
}