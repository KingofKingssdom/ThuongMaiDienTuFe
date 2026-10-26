"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard"
import { GetAllProductService } from "@/app/Services/ProductService"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
interface Product {
    Id: number,
    productName: string
    Ddescription: string
    urlImageProduct: string,
    isFeatured: boolean,
    isOnPromotion: boolean
}
export default function FlashSale() {
    const [product, setProduct] = useState<Product[]>();

    const fetchProduct = async () => {
        const data = await GetAllProductService();
        setProduct(data.data);
    }

    useEffect(() => {
        fetchProduct()
    }, [])
    console.log("Dữ liệu sản phẩm ", product)
    return (
        <>
            <div className="w-full mt-[50px]">
                <div className="mx-auto w-[98%]  lg:w-[80%] 2xl:w-[70%]">

                    <div className="bg-gradient-to-r from-[#e83d25] to-[#f06b4c] mx-auto  font-bold bg-red-600 text-white w-[40%] text-center rounded-t-2xl h-[30px] md:h-[50px] flex items-center justify-center shadow-lg ">
                        <p className="text-[15px] md:text-[30px]">FLASHSALE</p>
                    </div>
                    <div className="relative  bg-red-600 w-[100%] mx-auto rounded-[20px] md:rounded-[30px] h-[400px] border-5 border-solid border-[#f2d79f] overflow-hidden">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={5} // Khoảng cách giữa các card
                            slidesPerView={2}  // Mặc định cho màn hình nhỏ (mobile) hiện 2 card
                            navigation={{
                                nextEl: ".swiper-button-next-promotion",
                                prevEl: ".swiper-button-prev-promotion",
                            }}  // Hiển thị nút qua lại 2 bên
                            // Cấu hình số lượng card thay đổi theo kích thước màn hình (Responsive)
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                },
                                768: {
                                    slidesPerView: 4,
                                },
                                1024: {
                                    slidesPerView: 5,
                                },
                            }}
                            className="mySwiper px-2"
                        >
                            {product?.map((p) => (
                                <SwiperSlide key={p.Id} className="flex justify-center pb-4">
                                    <ProductCard product={p} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <button className="swiper-button-prev-promotion absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
                            <MdKeyboardArrowLeft />
                        </button>
                        <button className="swiper-button-next-promotion absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
                            <MdKeyboardArrowRight />
                        </button>
                    </div>

                </div>
            </div>

        </>
    )
}