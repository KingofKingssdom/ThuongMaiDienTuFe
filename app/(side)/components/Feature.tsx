"use client"
import ProductFeature from "./ProductFeature"
import { GetAllProductByIsFeature } from "@/app/Services/ProductService"
import { useEffect, useState } from "react";
interface Product {
    Id: number,
    productName: string
    Ddescription: string
    urlImageProduct: string,
    isFeatured: boolean,
    isOnPromotion: boolean,
    productVariants?: { currentPrice: number; originPrice?: number }[];
}

export default function Feature() {
    const [FeatureMobile, setFeatureMobile] = useState<Product[]>();
    const [FeatureTablet, setFeatureTablet] = useState<Product[]>();
    const fetchFeatureMobile = async () => {
        const data = await GetAllProductByIsFeature(1);
        setFeatureMobile(data.data);
    }

    useEffect(() => {
        fetchFeatureMobile()
    }, [])
    console.log("Dữ liệu sản phẩm điện thoại nổi bật ", FeatureMobile)

    const fetchFeatureTablet = async () => {
        const data = await GetAllProductByIsFeature(2);
        setFeatureTablet(data.data);
    }

    useEffect(() => {
        fetchFeatureTablet()
    }, [])
    console.log("Dữ liệu sản phẩm tablet nổi bật ", FeatureTablet)
    const formatProductsForUI = (products: Product[]) => {
        return products.map((p) => {
            // Lấy giá từ biến thể đầu tiên nếu có, hoặc để giá mặc định
            const variant = p.productVariants?.[0];
            const priceFormatted = variant ? `${variant.currentPrice.toLocaleString('vi-VN')}₫` : "Liên hệ";
            const oldPriceFormatted = variant?.originPrice ? `${variant.originPrice.toLocaleString('vi-VN')}₫` : undefined;

            return {
                id: p.Id,
                name: p.productName,
                price: priceFormatted,
                oldPrice: oldPriceFormatted,
                image: p.urlImageProduct,
                rating: 5, // Mặc định hoặc lấy từ API nếu có
                promoText: p.Ddescription,
            };
        });
    };
    return (
        <>
            <ProductFeature
                phones={formatProductsForUI(FeatureMobile)}
                tablets={formatProductsForUI(FeatureTablet)}
            />
        </>
    )
}