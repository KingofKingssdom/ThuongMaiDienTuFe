"use client"

import { useState } from "react"

export default function Footer() {
    const [selectItem, setSelectItem] = useState("");

    return (
        <>
            <div className="bg-[#f2f2f3] w-full pb-[30px]">
                <div className="mx-auto w-[98%]  md:w-[90%] 2xl:w-[70%] flex justify-center">
                    <div className="w-[30%] grid">
                        <p className="font-semibold mt-[20px]">Tổng đài hỗ trợ miễn phí</p>
                        <p className="mt-[20px]">Mua hàng - bảo hành <span className="font-semibold">1800.2097</span> (7h30 - 22h00)</p>
                        <p className="mt-[20px]">Khiếu nại   <span className="font-semibold">1800.2063</span> (8h00 - 21h30)</p>
                    </div>
                    <div className="w-[30%]">
                        <p className="font-semibold mt-[20px]">ĐĂNG KÝ THÀNH VIÊN MỚI</p>
                        <div className="mt-[10px]">
                            <label htmlFor="email" className="font-semibold text-[13px]">Email</label>
                            <div className={`flex items-center border border-solid  w-[250px] h-[40px] rounded-md ${selectItem === "email" ? "border-black" : "border-[#cfcfd3]"} `}>
                                <input type="text"
                                    id="email"
                                    onFocus={() => setSelectItem("email")}
                                    className="ml-[5px] mr-[5px] w-[100%] outline-none"
                                    placeholder="Nhập email của bạn" />
                            </div>
                        </div>
                        <div className="mt-[10px]">
                            <label htmlFor="phone" className="font-semibold text-[13px]">Số điện thoại</label>
                            <div className={`flex items-center border border-solid w-[250px] h-[40px] rounded-md ${selectItem === "phone" ? "border-black" : "border-[#cfcfd3]"}`}>
                                <input type="text"
                                    id="phone"
                                    onFocus={() => setSelectItem("phone")}
                                    className="ml-[5px] mr-[5px] w-[100%] outline-none"
                                    placeholder="Nhập số điện thoại của bạn" />
                            </div>
                        </div>
                        <div className="mt-[15px]">
                            <button className="hover:bg-red-800 h-[40px] bg-red-600 text-white w-[250px] rounded-md cursor-pointer hover:bg-round">
                                ĐĂNG KÍ NGAY
                            </button>
                        </div>
                    </div>
                    <div className="w-[30%]">
                        <p className="font-semibold mt-[20px]">Phương thức thanh toán</p>
                        <div className="flex">
                            <div className="">
                                Ảnh momo
                            </div>
                            <div className="">
                                Ảnh VNPAY
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}