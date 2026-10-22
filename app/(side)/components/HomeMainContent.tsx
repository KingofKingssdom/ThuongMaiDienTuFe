"use client"
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import CSS của Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const bannerList = [
    { id: 1, title: "IPHONE DUO", sub: "Ưu đãi cực khủng", content: "./image/IphoneDuoBanner.png" },
    { id: 2, title: "IPHONE 18 PRO", sub: "Mua ngay", content: "./image/Iphone18Banner.png" },
    { id: 3, title: " OPPO FIND X10 SERIES", sub: "Đăng ký nhận tin", content: "./image/OppoBanner.png" },
    { id: 4, title: "GALAXY Z8 SERIES", sub: "Gặp mở đẳng cấp", content: "./image/samsungBanner.png" },
];
export default function HomeMainContent() {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);
    return (
        <>
            <div className="w-full bg-white rounded-xl shadow-sm p-4">

                <div className="grid grid-cols-4 gap-2 mb-4 pb-2">
                    {bannerList.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => {

                                swiperRef.current?.slideTo(index);
                            }}
                            className={`text-center py-2 px-1 transition-all border-b-2 text-sm ${activeIndex === index
                                ? "border-red-600 text-red-600 font-bold"
                                : "border-transparent text-gray-600 hover:text-black"
                                }`}
                        >
                            <div className="truncate">{item.title}</div>
                            <div className="text-xs text-gray-400 truncate">{item.sub}</div>
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={15}
                        slidesPerView={1}
                        // Tự chạy sau 5 giây (5000ms), không dừng khi hover chuột (disableOnInteraction: false)
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        // Cho phép cầm kéo (grabCursor giúp hiện icon bàn tay khi rê chuột)
                        grabCursor={true}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        className="rounded-lg overflow-hidden"
                    >
                        {bannerList.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className=" bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">

                                    <img src={item.content} className="w-[100%] h-[100%]" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* 3. NÚT BẤM TRÁI / PHẢI (Hiện lên khi rê chuột vào khung banner - group-hover) */}
                    <div className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        ❮
                    </div>
                    <div className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        ❯
                    </div>
                </div>

            </div>
        </>
    )
}