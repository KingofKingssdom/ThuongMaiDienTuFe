import React from "react";
import Link from "next/link";
import { MdOutlinePhoneIphone, MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { FaTabletAlt, FaTv } from "react-icons/fa";
import { TbDeviceAirpods } from "react-icons/tb";
import { IoWatchOutline } from "react-icons/io5";
import { BsLaptop } from "react-icons/bs";
import { HiMiniComputerDesktop } from "react-icons/hi2";

interface HomeSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function HomeSidebar({ isOpen = true, onClose }: HomeSidebarProps) {
    // Nếu dùng dạng popup modal trên mobile thì kiểm tra trạng thái isOpen
    if (!isOpen) return null;

    const categories = [
        { href: "/mobile", name: "Điện thoại", icon: <MdOutlinePhoneIphone className="w-5 h-5 text-red-600" /> },
        { href: "/tablet", name: "Tablet", icon: <FaTabletAlt className="w-5 h-5 text-red-600" /> },
        { href: "/sound", name: "Âm thanh", icon: <TbDeviceAirpods className="w-5 h-5 text-red-600" /> },
        { href: "/watch", name: "Đồng hồ", icon: <IoWatchOutline className="w-5 h-5 text-red-600" /> },
        { href: "/laptop", name: "Laptop", icon: <BsLaptop className="w-5 h-5 text-red-600" /> },
        { href: "/television", name: "Tivi", icon: <FaTv className="w-5 h-5 text-red-600" /> },
        { href: "/screen", name: "Màn hình máy tính", icon: <HiMiniComputerDesktop className="w-5 h-5 text-red-600" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-start md:relative md:inset-auto">

            <div
                className="fixed inset-0 bg-black/50 transition-opacity md:hidden"
                onClick={onClose}
            />


            <div className="relative bg-white w-full md:w-[260px] rounded-t-3xl md:rounded-xl shadow-2xl p-4 max-h-[80vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">

                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 md:hidden">
                    <h3 className="font-bold text-base text-gray-800">Danh mục sản phẩm</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>


                <div className="flex flex-col gap-1">
                    {categories.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white shadow-sm">
                                    {item.icon}
                                </div>
                                <span className="font-semibold text-sm text-gray-700 group-hover:text-red-600">
                                    {item.name}
                                </span>
                            </div>
                            <MdKeyboardArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}