"use client"
import { BiCategory } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { TbInvoice } from "react-icons/tb";
import { LuPhoneCall } from "react-icons/lu";
export default function Header() {
    return (
        <>
            <div className="relative w-full bg-gradient-to-b from-[#e24c5a] to-red-600 overflow-hidden">
                <div className=" mx-auto w-[98%]  lg:w-[80%] 2xl:w-[70%]">
                    <div className="w-full">
                        <div className="flex h-[25px] items-center">
                            <div className="w-[95%] md:w-[60%] xl:w-[70%]">
                                Nội dung chạy quảng cáo
                            </div>
                            <div className="h-[20px] cursor-pointer hover:text-[13px] border-l border-solid border-white w-[20%] justify-center hidden md:flex items-center text-white">
                                <TbInvoice className="w-[15px] h-[15px]" />
                                <p>Tra cứu đơn hàng</p>
                            </div>
                            <div className="h-[20px] cursor-pointer hover:text-[13px] border-l border-solid border-white w-[15%] justify-center hidden md:flex items-center text-white">
                                <LuPhoneCall className="w-[15px] h-[15px]" />
                                <p>1800 2097</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden sticky items-center flex top-0 z-[3px] mx-auto h-[62px] w-full">
                        <div className="w-[55px] h-[55px]">
                            <img src="./image/Logo.png" alt="Logo" className="w-[100%] h-[100%]" />
                        </div>
                        <div className="hidden  cursor-pointer hover:bg-red-600 ml-[10px] xl:ml-[30px] h-[40px] w-[150px] rounded-md bg-[#e45464] md:flex items-center justify-center text-white">
                            <BiCategory className="h-[25px] w-[25px]" />
                            <p className="w-[80px] text-center">Danh mục</p>
                            <IoIosArrowDown className="h-[25px] w-[25px]" />
                        </div>
                        <div className="hidden cursor-pointer hover:bg-red-600 ml-[10px] xl:ml-[30px] h-[40px] w-[150px] rounded-md bg-[#e45464] md:flex items-center justify-center text-white">
                            <BiCategory className="h-[25px] w-[25px]" />
                            <p className="w-[80px] text-center">Địa điểm</p>
                            <IoIosArrowDown className="h-[25px] w-[25px]" />
                        </div>
                        <div className="w-[80%] md:w-[60%] lg:w-[40%]">
                            <div className="bg-white rounded-md h-[40px] flex items-center ml-[30px]">
                                <CiSearch className="h-[25px] w-[25px]" />
                                <input type="text" className="outline-none w-[90%]"
                                    placeholder="Bạn muốn mua gì hôm nay ?"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="cursor-pointer hover:bg-red-600 ml-[10px] xl:ml-[30px] h-[40px] w-[40px] xl:w-[120px] rounded-md flex items-center justify-center text-white">
                                <p className="hidden xl:block">Giỏ hàng</p>
                                <IoCartOutline className="h-[25px] w-[25px]" />
                            </div>
                        </div>
                        <div className="hidden cursor-pointer hover:bg-red-600 ml-[10px] xl:ml-[30px] h-[40px] w-[120px] rounded-md bg-[#e45464] md:flex items-center justify-center text-white">

                            <p className="w-[80px] text-center">Tên user</p>
                            <FaRegUserCircle className="h-[25px] w-[25px]" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}