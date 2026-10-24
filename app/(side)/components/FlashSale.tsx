"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard"
import { GetAllProductService } from "@/app/Services/ProductService"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
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
                    <div className="bg-red-600 w-[100%] mx-auto rounded-[20px] md:rounded-[30px] h-[400px] border-5 border-solid border-[#f2d79f] overflow-hidden">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={5} // Khoảng cách giữa các card
                            slidesPerView={2}  // Mặc định cho màn hình nhỏ (mobile) hiện 2 card
                            navigation={true}  // Hiển thị nút qua lại 2 bên
                            // Cấu hình số lượng card thay đổi theo kích thước màn hình (Responsive)
                            breakpoints={{
                                640: {
                                    slidesPerView: 3, // Màn hình >= 640px hiện 3 card
                                },
                                768: {
                                    slidesPerView: 4, // Màn hình >= 768px hiện 4 card
                                },
                                1024: {
                                    slidesPerView: 5, // Màn hình >= 1024px hiện 5 card
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
                    </div>
                </div>
            </div>

        </>
    )
}