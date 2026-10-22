import HomeSidebar from "./components/HomeSidebar"
import HomeMainContent from "./components/HomeMainContent"
import FlashSale from "./components/FlashSale"
export default function Home() {
    return (
        <>
            <div>
                <div className="w-full">
                    <div className="mx-auto w-[98%]  lg:w-[80%] 2xl:w-[70%]">
                        <div className="flex">
                            <div className="hidden lg:block">
                                <HomeSidebar />
                            </div>

                            <div className="w-[90%] lg:w-[70%] mt-[10px] ml-[10px]">
                                <HomeMainContent />
                            </div>

                        </div>
                    </div>
                    <FlashSale />
                </div>

            </div>
        </>
    )
}