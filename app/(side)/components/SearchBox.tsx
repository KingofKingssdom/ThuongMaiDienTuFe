"use client"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { GetProductByName } from "@/app/Services/ProductService";
interface Product {
    id: number;
    productName: string;
    urlImageProduct: string;
    productVariants?: { currentPrice: number }[];
}

export default function SearchBox() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const fetchSearchResults = async () => {
            if (keyword.trim() === "") {
                setResults([]);
                setIsOpen(false);
                return;
            }

            try {

                const response = await GetProductByName(keyword);
                const data = await response;
                setResults(data.data || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Lỗi tìm kiếm sản phẩm:", error);
            }
        };

        const timer = setTimeout(() => {
            fetchSearchResults();
        }, 300); // Debounce 300ms tránh gọi API liên tục khi đang gõ

        return () => clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={searchRef}>

            <div className="bg-white rounded-md h-[40px] flex items-center px-3 shadow-sm w-full">
                <CiSearch className="h-[25px] w-[25px] text-gray-400 mr-2" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => { if (keyword.trim() !== "") setIsOpen(true); }}
                    className="outline-none w-full text-sm text-gray-700 bg-transparent"
                    placeholder="Bạn muốn mua gì hôm nay ?"
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[400px] overflow-y-auto z-[100]">
                    <div className="p-2 text-xs font-semibold text-gray-400 border-b border-gray-100">
                        Sản phẩm gợi ý
                    </div>
                    {results.map((product) => {
                        const price = product.productVariants?.[0]?.currentPrice
                            ? `${product.productVariants[0].currentPrice.toLocaleString("vi-VN")}₫`
                            : "Liên hệ";

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                            >
                                <img
                                    src={`https:localhost:7276/${product.urlImageProduct}`}
                                    alt={product.productName}
                                    className="w-12 h-12 object-contain rounded-md border border-gray-100 p-1"
                                />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{product.productName}</h4>
                                    <span className="text-red-600 font-bold text-xs">{price}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
