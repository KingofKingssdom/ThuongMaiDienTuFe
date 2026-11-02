import React, { useState, useEffect } from "react";
import { TbInvoice } from "react-icons/tb";
import { LuPhoneCall } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import HomeSidebar from "./HomeSidebar";
import SearchBox from "./SearchBox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
export default function Header() {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName");
        if (token) {
            setIsLoggedIn(true);
            if (name) setUserName(name);
        }
    }, []);

    const handleCartClick = (e: React.MouseEvent) => {
        const token = localStorage.getItem("token");
        if (!token) {
            e.preventDefault();
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            router.push("/login");
        }
    };

    const handleOrderClick = (e: React.MouseEvent) => {
        const token = localStorage.getItem("token");
        if (!token) {
            e.preventDefault();
            alert("Vui lòng đăng nhập để xem đơn hàng!");
            router.push("/login");
        }
    }

    const handleUserClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setShowDropdown(!showDropdown);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
        setShowDropdown(false);
        router.push("/login");
    };
    return (
        <>
            <div className="relative w-full bg-gradient-to-b from-[#e24c5a] to-red-600">
                <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                    <div className="w-full">
                        <div className="flex h-[25px] items-center">
                            <div className="w-[95%] md:w-[60%] xl:w-[70%] text-white text-xs md:text-sm">
                                Nội dung chạy quảng cáo
                            </div>
                            <Link href="/order" onClick={handleOrderClick} className="hidden md:block">

                                <div className="cursor-pointer hover:text-[13px] ml-[10px] xl:ml-[30px] w-[160px] rounded-md flex items-center justify-center text-white transition-colors">
                                    <TbInvoice className="w-[15px] h-[15px] mr-1" />
                                    <p className="w-[160px]">Tra cứu đơn hàng</p>
                                </div>
                            </Link>

                            <div className="h-[20px] cursor-pointer hover:text-[13px] border-l border-solid border-white w-[15%] justify-center hidden md:flex items-center text-white">
                                <LuPhoneCall className="w-[15px] h-[15px] mr-1" />
                                <p>1800 2097</p>
                            </div>
                        </div>
                    </div>

                    <div className="sticky items-center flex top-0 z-[3px] mx-auto h-[62px] w-full">
                        <Link href="./" className="w-[55px] h-[55px] shrink-0">
                            <img src="./image/Logo.png" alt="Logo" className="w-[100%] h-[100%] object-contain" />
                        </Link>

                        <div
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="hidden cursor-pointer hover:bg-red-700 ml-[10px] xl:ml-[30px] h-[40px] w-[150px] shrink-0 rounded-md bg-[#e45464] md:flex items-center justify-center text-white transition-colors relative"
                        >
                            <BiCategory className="h-[25px] w-[25px] mr-1" />
                            <p className="w-[80px] text-center">Danh mục</p>
                            <IoIosArrowDown className={`h-5 w-5 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`} />
                        </div>

                        <div className="hidden cursor-pointer hover:bg-red-700 ml-[10px] xl:ml-[30px] h-[40px] w-[150px] shrink-0 rounded-md bg-[#e45464] md:flex items-center justify-center text-white transition-colors">
                            <CiLocationOn className="h-[25px] w-[25px] mr-1" />
                            <p className="w-[80px] text-center">Địa điểm</p>
                        </div>


                        <div className="flex-1 mx-[20px] relative z-20">
                            <SearchBox />
                        </div>

                        <Link href="/cart" onClick={handleCartClick} className="shrink-0">
                            <div className="cursor-pointer hover:bg-red-700 ml-[10px] xl:ml-[30px] h-[40px] w-[40px] xl:w-[120px] rounded-md flex items-center justify-center text-white transition-colors">
                                <p className="hidden xl:block mr-2">Giỏ hàng</p>
                                <IoCartOutline className="h-[25px] w-[25px]" />
                            </div>
                        </Link>

                        <div className="relative">
                            <div
                                onClick={handleUserClick}
                                className="hidden cursor-pointer hover:bg-red-700 ml-[10px] xl:ml-[30px] h-[40px] w-[120px] shrink-0 rounded-md bg-[#e45464] md:flex items-center justify-center text-white transition-colors"
                            >
                                <p className="w-[80px] text-center truncate">{isLoggedIn ? userName : "Đăng nhập"}</p>
                                <FaRegUserCircle className="h-[25px] w-[25px] ml-1" />
                            </div>


                            {isLoggedIn && showDropdown && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <IoIosLogOut className="w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isCategoryOpen && (
                <div className="fixed inset-0 z-[999] flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={() => setIsCategoryOpen(false)}
                    />

                    <div className="relative z-10 m-4 md:mt-24 md:ml-[5%] lg:ml-[15%]">
                        <HomeSidebar
                            isOpen={isCategoryOpen}
                            onClose={() => setIsCategoryOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}