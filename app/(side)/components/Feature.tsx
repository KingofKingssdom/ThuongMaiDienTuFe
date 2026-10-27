"use client"
import { useEffect, useState } from "react";
import { GetAllProductByIsFeature } from "@/app/Services/ProductService";
import { UIProduct } from "./ProductFeature";
import ProductFeature from "./ProductFeature";
// Khớp với JSON backend trả về
interface ProductVariant {
    currentPrice: number;
    originPrice?: number;
}

interface Product {
    id: number; // Chỉnh lại thành id thường theo đúng JSON backend
    productName: string;
    description: string; // Khớp với trường Ddescription/description ở backend
    urlImageProduct: string;
    isFeatured: boolean;
    isOnPromotion: boolean;
    productVariants?: ProductVariant[];
}

export default function FeatureContainer() {
    const [FeatureMobile, setFeatureMobile] = useState<Product[]>([]);
    const [FeatureTablet, setFeatureTablet] = useState<Product[]>([]);
    const [FeatureSound, setFeatureSound] = useState<Product[]>([]);
    const [FeatureWatch, setFeatureWatch] = useState<Product[]>([]);
    const [FeatureTivi, setFeatureTivi] = useState<Product[]>([]);

    const fetchFeatureMobile = async () => {
        try {
            const res = await GetAllProductByIsFeature(1);
            setFeatureMobile(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải điện thoại nổi bật:", error);
        }
    };

    const fetchFeatureTablet = async () => {
        try {
            const res = await GetAllProductByIsFeature(2);
            setFeatureTablet(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải tablet nổi bật:", error);
        }
    };

    const fetchFeatureSound = async () => {
        try {
            const res = await GetAllProductByIsFeature(3);
            setFeatureSound(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải sound nổi bật:", error);
        }
    };
    const fetchFeatureWatch = async () => {
        try {
            const res = await GetAllProductByIsFeature(4);
            setFeatureWatch(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải sound nổi bật:", error);
        }
    };
    const fetchFeatureTivi = async () => {
        try {
            const res = await GetAllProductByIsFeature(6);
            setFeatureTivi(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải tivi nổi bật:", error);
        }
    };
    useEffect(() => {
        fetchFeatureMobile();
        fetchFeatureTablet();
        fetchFeatureSound();
        fetchFeatureWatch();
        fetchFeatureTivi();
    }, []);


    // Hàm format dữ liệu từ API sang cấu trúc UI hiển thị
    const formatProductsForUI = (products: Product[]): UIProduct[] => {
        if (!products) return [];
        return products.map((p) => {
            const variant = p.productVariants?.[0];
            const priceFormatted = variant
                ? `${variant.currentPrice.toLocaleString("vi-VN")}₫`
                : "Giá liên hệ";
            const oldPriceFormatted = variant?.originPrice
                ? `${variant.originPrice.toLocaleString("vi-VN")}₫`
                : undefined;

            return {
                id: p.id,
                name: p.productName,
                price: priceFormatted,
                oldPrice: oldPriceFormatted,
                image: p.urlImageProduct.startsWith("http")
                    ? p.urlImageProduct
                    : `https://localhost:7276/${p.urlImageProduct}`,
                rating: 5,
                promoText: p.description,
            };
        });
    };

    return (
        <>
            <ProductFeature
                tab1Title="ĐIỆN THOẠI NỔI BẬT"
                tab1Data={formatProductsForUI(FeatureMobile)}
                tab2Title="MÁY TÍNH BẢNG NỔI BẬT"
                tab2Data={formatProductsForUI(FeatureTablet)}
                nextButtonCustom="nextMobileAndTablet"
                prevButtonCustom="prevMobileAndTablet"
            />


            <ProductFeature
                tab1Title="TAI NGHE NỔI BẬT"
                tab1Data={formatProductsForUI(FeatureSound)}
                tab2Title="ĐỒNG HỒ NỔI BẬT"
                tab2Data={formatProductsForUI(FeatureWatch)}
                nextButtonCustom="nextSoundAndWatch"
                prevButtonCustom="prevSoundAndWatch"
            />

            <ProductFeature
                tab1Title="SMART TIVI"
                tab1Data={formatProductsForUI(FeatureTivi)}
                tab2Title="LAPTOP NỔI BẬT"
                tab2Data={formatProductsForUI(FeatureWatch)}
                nextButtonCustom="nextSmartAndLap"
                prevButtonCustom="prevSmartAndLap"
            />
        </>
    );
}