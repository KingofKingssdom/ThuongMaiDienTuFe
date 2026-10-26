"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Import CSS của Swiper
import "swiper/css";
import "swiper/css/navigation";

// Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
    id: number;
    name: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    image: string;
    promoText?: string;
    rating: number;
}

export default function ProductFeature() {
    // State quản lý tab chính (Điện thoại / Máy tính bảng)
    const [activeTab, setActiveTab] = useState<"phone" | "tablet">("phone");

    // Dữ liệu mẫu sản phẩm theo tab
    const productsData: Record<string, Product[]> = {
        phone: [
            { id: 1, name: "iPhone 18 Pro 256GB", price: "38.690.000₫", oldPrice: "39.990.000₫", discount: "Giảm 1%", image: "https://via.placeholder.com/200", promoText: "Chỉ thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB...", rating: 5 },
            { id: 2, name: "iPhone 17 Pro 256GB | Chính hãng", price: "31.990.000₫", oldPrice: "34.990.000₫", discount: "Giảm 9%", image: "https://via.placeholder.com/200", promoText: "Chỉ thêm 30K - nhận Sim/Esim 5G VNSKY, có ngay 3GB...", rating: 5 },
            { id: 3, name: "iPhone 17 Pro Max 256GB | Chính hãng", price: "34.990.000₫", oldPrice: "37.990.000₫", discount: "Giảm 8%", image: "https://via.placeholder.com/200", promoText: "Ưu đãi mua kèm Gói cam kết giá thu S-Buy Back với giá từ 1TR...", rating: 5 },
            { id: 4, name: "iPhone 18 Pro Max 512GB", price: "48.490.000₫", image: "https://via.placeholder.com/200", promoText: "Ưu đãi 500K cho Apple Watch Series 12, Ultra 4 khi mua kèm...", rating: 5 },
            { id: 5, name: "Samsung Galaxy S26 Ultra", price: "31.990.000₫", discount: "Giảm 14%", image: "https://via.placeholder.com/200", promoText: "S-Student | S-Teacher Giảm thêm 500.000đ", rating: 5 },
        ],
        tablet: [
            { id: 101, name: "iPad Pro M4 11 inch 256GB", price: "28.990.000₫", oldPrice: "30.990.000₫", discount: "Giảm 6%", image: "https://via.placeholder.com/200", promoText: "Tặng kèm bút Apple Pencil trị giá 2.990.000đ", rating: 5 },
            { id: 102, name: "Samsung Galaxy Tab S10 Ultra", price: "26.490.000₫", oldPrice: "29.990.000₫", discount: "Giảm 11%", image: "https://via.placeholder.com/200", promoText: "Giảm thêm 1 triệu khi thu cũ đổi mới", rating: 5 },
            { id: 103, name: "Xiaomi Pad 7 Pro", price: "10.990.000₫", image: "https://via.placeholder.com/200", promoText: "Tặng bao da bàn phím chính hãng", rating: 4 },
            { id: 104, name: "iPad Air 13 inch (M2)", price: "21.990.000₫", discount: "Giảm 5%", image: "https://via.placeholder.com/200", promoText: "Trả góp 0% lãi suất", rating: 5 },
        ]
    };

    const currentProducts = productsData[activeTab] || [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 rounded-2xl shadow-sm bg-gray-300 mt-[30px]">

            <div className="flex border-b border-gray-200 mb-4">
                <button
                    onClick={() => setActiveTab("phone")}
                    className={`flex-1 pb-3 text-center font-bold text-base transition-all relative ${activeTab === "phone" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    ĐIỆN THOẠI
                </button>
                <button
                    onClick={() => setActiveTab("tablet")}
                    className={`flex-1 pb-3 text-center font-bold text-base transition-all relative ${activeTab === "tablet" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    MÁY TÍNH BẢNG
                </button>
            </div>

            {/* 4. KHUNG HIỂN THỊ SẢN PHẨM (SWIPER SLIDER KÉO THẢ) */}
            <div className="relative group">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={2}
                    navigation={{
                        nextEl: ".swiper-button-next-custom",
                        prevEl: ".swiper-button-prev-custom",
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="pb-6"
                >
                    {currentProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <div className="border border-gray-200 rounded-2xl p-3 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative bg-white">

                                {/* Badge giảm giá */}
                                {product.discount && (
                                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-xl z-10">
                                        {product.discount}
                                    </span>
                                )}

                                {/* Hình ảnh sản phẩm */}
                                <div className="w-full h-44 flex items-center justify-center mb-3 relative">
                                    <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                                </div>

                                {/* Tên sản phẩm */}
                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                                    {product.name}
                                </h3>

                                {/* Giá tiền */}
                                <div className="mb-2">
                                    <div className="text-red-600 font-bold text-base">{product.price}</div>
                                    {product.oldPrice && (
                                        <div className="text-gray-400 text-xs line-through">{product.oldPrice}</div>
                                    )}
                                </div>

                                {/* Khuyến mãi / Quà tặng */}
                                {product.promoText && (
                                    <div className="bg-gray-50 text-gray-600 text-[11px] p-2 rounded-lg mb-3 line-clamp-2">
                                        {product.promoText}
                                    </div>
                                )}


                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button className=" swiper-button-prev-custom absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
                    <MdKeyboardArrowLeft />
                </button>
                <button className="swiper-button-next-custom absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
                    <MdKeyboardArrowRight />
                </button>
            </div>

        </div>
    );
}