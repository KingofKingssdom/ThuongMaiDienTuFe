"use client"
import { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { TbInvoice } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
interface SecondaryProps {
    onOpenCategory?: () => void;
}

export default function Secondary({ onOpenCategory }: SecondaryProps) {
    const [activeTab, setActiveTab] = useState<string>("");

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
        if (tabName === "category" && onOpenCategory) {
            onOpenCategory();
        }
    };

    return (
        <div className="flex items-center justify-evenly py-2 bg-white border-t border-gray-200 shadow-lg">
            {/* Danh mục */}
            <div
                onClick={() => handleTabClick("category")}
                className={`cursor-pointer w-[100px] flex flex-col items-center justify-center py-1 transition-colors ${activeTab === "category" ? "text-red-600" : "text-gray-600 hover:text-red-600"
                    }`}
            >
                <BiCategory className="h-[20px] w-[20px] mx-auto" />
                <p className="w-[80px] text-center mx-auto font-semibold text-[13px]">Danh mục</p>
            </div>

            {/* Đơn hàng */}
            <div
                onClick={() => handleTabClick("order")}
                className={`cursor-pointer w-[100px] flex flex-col items-center justify-center py-1 transition-colors ${activeTab === "order" ? "text-red-600" : "text-gray-600 hover:text-red-600"
                    }`}
            >
                <TbInvoice className="h-[20px] w-[20px] mx-auto" />
                <p className="w-[80px] text-center mx-auto font-semibold text-[13px]">Đơn hàng</p>
            </div>

            {/* Địa điểm */}
            <div
                onClick={() => handleTabClick("location")}
                className={`cursor-pointer w-[100px] flex flex-col items-center justify-center py-1 transition-colors ${activeTab === "location" ? "text-red-600" : "text-gray-600 hover:text-red-600"
                    }`}
            >
                <CiLocationOn className="h-[20px] w-[20px] mx-auto" />
                <p className="w-[80px] text-center mx-auto font-semibold text-[13px]">Địa điểm</p>
            </div>

            {/* Tài khoản (Username) */}
            <div
                onClick={() => handleTabClick("user")}
                className={`cursor-pointer w-[100px] flex flex-col items-center justify-center py-1 transition-colors ${activeTab === "user" ? "text-red-600" : "text-gray-600 hover:text-red-600"
                    }`}
            >
                <FaRegUserCircle className="h-[20px] w-[20px] mx-auto" />
                <p className="w-[80px] text-center mx-auto font-semibold text-[13px]">Tài khoản</p>
            </div>
        </div>
    );
}