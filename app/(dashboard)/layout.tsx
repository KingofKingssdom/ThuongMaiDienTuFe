"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    MdDashboard,
    MdInventory,
    MdCategory,
    MdBrandingWatermark,
    MdLayers,
    MdLogout,
    MdMenu,
    MdClose
} from "react-icons/md";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        router.push("/login");
    };

    const menuItems = [
        { name: "Tổng quan", href: "/dashboard", icon: <MdDashboard className="w-5 h-5" /> },
        { name: "Quản lý Sản phẩm", href: "/dashboard/products", icon: <MdInventory className="w-5 h-5" /> },
        { name: "Biến thể sản phẩm", href: "/dashboard/variants", icon: <MdLayers className="w-5 h-5" /> },
        { name: "Thương hiệu (Brand)", href: "/dashboard/brands", icon: <MdBrandingWatermark className="w-5 h-5" /> },
        { name: "Danh mục (Category)", href: "/dashboard/categories", icon: <MdCategory className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-100 relative">

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                />
            )}


            <aside className={`bg-slate-900 text-white w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}>
                <div>

                    <div className="h-16 flex items-center justify-between px-6 bg-slate-950 font-bold text-lg text-red-500 tracking-wider">
                        <span>ADMIN DASHBOARD</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
                        >
                            <MdClose className="w-6 h-6" />
                        </button>
                    </div>


                    <nav className="p-4 space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)} // Bấm vào link trên mobile sẽ tự động đóng sidebar lại
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 bg-slate-950">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors cursor-pointer"
                    >
                        <MdLogout className="w-5 h-5" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>


            <div className="flex-1 md:ml-64 flex flex-col min-w-0">

                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden cursor-pointer"
                    >
                        <MdMenu className="w-6 h-6" />
                    </button>
                    <div className="font-semibold text-gray-800 text-base truncate ml-2 md:ml-0">
                        Hệ thống Quản lý Thương mại Điện tử
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                            AD
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}