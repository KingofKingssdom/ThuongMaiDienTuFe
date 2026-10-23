
import Link from "next/link"
export default function ProductCart() {
    return (
        <>
            <Link href="#" className="bg-white">
                <div>
                    <img src="./" alt="" />
                </div>
                <div className="min-h-[30px]">
                    Tên sản phẩm
                </div>
                <div className="flex">
                    <p>1000000</p>
                    <p>50000</p>
                </div>
                <div>
                    Thông tin mô tả thêm về khuyễn mãi
                </div>
            </Link>
        </>
    )
}