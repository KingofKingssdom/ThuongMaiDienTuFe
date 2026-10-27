"use client"
import { GetAllBrandByCategoryId } from "@/app/Services/BrandService"
import { useEffect, useState } from "react"

interface Brand {
    id: number;
    brandName: string,
    urlImageBrand: string
}
interface ProductListProps {
    categoryId: number,
    title: string
}
export default function ProductList({ categoryId, title }: ProductListProps) {
    const [brand, setBrand] = useState<Brand[]>([])
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);


    const fetchAllBrandByCategory = async () => {
        try {
            const res = await GetAllBrandByCategoryId(categoryId);
            setBrand(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải sound nổi bật:", error);
        }
    }

    useEffect(() => {
        fetchAllBrandByCategory();
    }, [categoryId])
    const handleSelectBrand = (id: number) => {
        setSelectedBrandId(id);
        console.log("ID Brand đang được chọn để lọc sản phẩm:", id);
    };

    return (
        <div className="pt-[20px] pb-[20px]">
            <p className="font-bold text-[20px]">{title}</p>

            {/* Danh sách các Brand */}
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

            <div className="mt-4">
                Danh sách sản phẩm (Đang lọc theo Brand ID: {selectedBrandId ? selectedBrandId : "Tất cả"})
            </div>
        </div>
    );
}