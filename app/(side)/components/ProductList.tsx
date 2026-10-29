"use client"
import { GetAllBrandByCategoryId } from "@/app/Services/BrandService"
import { useEffect, useState } from "react"
import { GetAllProductByCategoryAndBrand } from "@/app/Services/ProductService"

interface Brand {
    id: number;
    brandName: string;
    urlImageBrand: string;
}

interface ProductVariant {
    currentPrice: number;
    originPrice?: number;
}

interface Product {
    id: number;
    productName: string;
    description: string;
    urlImageProduct: string;
    isFeatured: boolean;
    isOnPromotion: boolean;
    productVariants?: ProductVariant[];
}

interface ProductListProps {
    categoryId: number;
    title: string;
}

export default function ProductList({ categoryId, title }: ProductListProps) {
    const [brand, setBrand] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);


    const fetchAllBrandByCategory = async () => {
        try {
            const res = await GetAllBrandByCategoryId(categoryId);
            setBrand(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải thương hiệu:", error);
        }
    };


    const fetchProducts = async (catId: number, brandId: number | null) => {
        try {

            const res = await GetAllProductByCategoryAndBrand(catId, brandId);
            setProducts(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    };


    useEffect(() => {
        fetchAllBrandByCategory();
        setSelectedBrandId(null);
        fetchProducts(categoryId, null);
    }, [categoryId]);


    const handleSelectBrand = (id: number) => {

        const newBrandId = selectedBrandId === id ? null : id;
        setSelectedBrandId(newBrandId);


        fetchProducts(categoryId, newBrandId);
    };

    return (
        <div className="pt-[20px] pb-[20px]">
            <p className="font-bold text-[20px]">{title}</p>


            <div className="flex flex-wrap gap-2 mt-[20px]">
                {brand.map((b) => {
                    const isSelected = selectedBrandId === b.id;
                    return (
                        <div
                            key={b.id}
                            onClick={() => handleSelectBrand(b.id)}
                            className={`cursor-pointer border rounded-md w-[100px] h-[35px] overflow-hidden p-[5px] flex items-center justify-center transition-all ${isSelected
                                ? "border-red-600 border-2 shadow-sm bg-red-50/20"
                                : "border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            <img
                                src={`https://localhost:7276/${b.urlImageBrand}`}
                                alt={b.brandName || "Brand logo"}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    );
                })}
            </div>


            <div className="mt-6">
                {/* <p className="font-semibold text-gray-700 mb-4">
                    Danh sách sản phẩm (Đang lọc theo Brand ID: {selectedBrandId ? selectedBrandId : "Tất cả"})
                </p> */}


                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {products.length > 0 ? (
                        products.map((p) => (
                            <div key={p.id} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm flex flex-col justify-between">
                                <div className="w-full h-36 md:h-40 flex items-center justify-center mb-2">
                                    <img
                                        src={`https://localhost:7276/${p.urlImageProduct}`}
                                        alt={p.productName}
                                        className="max-h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-2">{p.productName}</h3>
                                <p className="text-[11px] md:text-xs text-gray-500 line-clamp-2 mb-2">{p.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm col-span-full text-center py-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                    )}
                </div>
            </div>
        </div>
    );
}