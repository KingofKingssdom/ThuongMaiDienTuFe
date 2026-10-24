
import Link from "next/link"
interface Product {
    Id: number;
    productName: string;
    Ddescription: string;
    urlImageProduct: string;
    isFeatured: boolean;
    isOnPromotion: boolean;
}

// 2. Khai báo props nhận vào có chứa object product
interface ProductProps {
    product?: Product;
}
export default function ProductCard({ product }: ProductProps) {

    return (
        <>
            <Link href="#" className="overflow-hidden group bg-white max-w-[225px] block p-[10px] rounded-lg shadow-[0_0_5px_3px] shadow-[#d5d8df] mt-[20px] ml-[7px] mr-[7px]">
                <div className="w-[150px] h-[150px] mx-auto">
                    <img src={`https://localhost:7276/${product?.urlImageProduct}`} alt="" className="w-[100%] h-[100%] object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="min-h-[70px] mt-[10px] font-semibold">
                    {product?.productName}
                </div>
                <div className="flex items-center">
                    <p className="text-red-600 font-semibold text-[20px] mr-[5px]">100000</p>
                    <p className="text-gray-500 text-[13px] line-through">50000</p>
                </div>
                <div>
                    Thông tin mô tả thêm về khuyễn mãi
                </div>
            </Link>
        </>
    )
}