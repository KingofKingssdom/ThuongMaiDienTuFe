import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
// Import CSS của Swiper nếu chưa có ở file root
import "swiper/css";
import "swiper/css/navigation";

// Interface cho UI sản phẩm sau khi format
export interface UIProduct {
    id: number;
    name: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    image: string;
    promoText?: string;
    rating: number;
}

interface ProductFeatureProps {
    tab1Title?: string;
    tab1Data?: UIProduct[];
    tab2Title?: string;
    tab2Data?: UIProduct[];
    nextButtonCustom: string,
    prevButtonCustom: string
}

export default function ProductFeature({
    tab1Title = "ĐIỆN THOẠI",
    tab1Data = [],
    tab2Title = "MÁY TÍNH BẢNG",
    tab2Data = [],
    nextButtonCustom,
    prevButtonCustom
}: ProductFeatureProps) {

    const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

    const currentProducts = activeTab === "tab1" ? tab1Data : tab2Data;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 rounded-2xl shadow-sm bg-gray-100 mt-[30px]">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    onClick={() => setActiveTab("tab1")}
                    className={`flex-1 pb-3 text-center font-bold text-base transition-all relative ${activeTab === "tab1"
                        ? "text-red-600 border-b-2 border-red-600"
                        : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    {tab1Title}
                </button>
                <button
                    onClick={() => setActiveTab("tab2")}
                    className={`flex-1 pb-3 text-center font-bold text-base transition-all relative ${activeTab === "tab2"
                        ? "text-red-600 border-b-2 border-red-600"
                        : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    {tab2Title}
                </button>
            </div>

            <div className="relative ">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={2}
                    navigation={{
                        nextEl: `.${nextButtonCustom}`,
                        prevEl: `.${prevButtonCustom}`,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="pb-6"
                >
                    {currentProducts.map((product) => (
                        <SwiperSlide key={product.id} className="h-auto pb-[20px]">
                            <Link href="#" className="min-h-[370px] group border border-gray-200 rounded-2xl p-3 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative bg-white">

                                {product.discount && (
                                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-xl z-10">
                                        {product.discount}
                                    </span>
                                )}


                                <div className="w-full h-44 flex items-center justify-center mb-3 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>


                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                                    {product.name}
                                </h3>


                                <div className="mb-2 flex items-center">
                                    <div className="text-red-600 font-bold text-base">
                                        {product.price}
                                    </div>
                                    {product.oldPrice && (
                                        <div className="text-gray-400 text-xs line-through ml-[5px]">
                                            {product.oldPrice}
                                        </div>
                                    )}
                                </div>


                                {product.promoText && (
                                    <div className="bg-gray-50 text-gray-600 text-[13px] p-2 rounded-lg mb-3 line-clamp-3 min-h-[50px]">
                                        {product.promoText}
                                    </div>
                                )}
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>


                <button className={`${prevButtonCustom} absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all cursor-pointer`}>
                    <MdKeyboardArrowLeft size={24} />
                </button>
                <button className={`${nextButtonCustom} absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all cursor-pointer`}>
                    <MdKeyboardArrowRight size={24} />
                </button>
            </div>
        </div>
    );
}