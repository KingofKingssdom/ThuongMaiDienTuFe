import ProductCart from "./ProductCard/ProductCard"
export default function FlashSale() {
    return (
        <>
            <div className="w-full mt-[50px]">
                <div className="mx-auto w-[98%]  lg:w-[80%] 2xl:w-[70%]">

                    <div className="bg-gradient-to-r from-[#e83d25] to-[#f06b4c] mx-auto  font-bold bg-red-600 text-white w-[40%] text-center rounded-t-2xl h-[30px] md:h-[50px] flex items-center justify-center shadow-lg ">
                        <p className="text-[15px] md:text-[30px]">FLASHSALE</p>
                    </div>
                    <div className="bg-red-600 w-[100%] mx-auto rounded-[20px] md:rounded-[30px] h-[400px] border-5 border-solid border-[#f2d79f] overflow-hidden">
                        <div>
                            <ProductCart />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}