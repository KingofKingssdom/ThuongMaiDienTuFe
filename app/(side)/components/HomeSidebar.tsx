import Link from "next/link"
import { MdOutlinePhoneIphone, MdKeyboardArrowRight } from "react-icons/md";
import { FaTabletAlt, FaTv } from "react-icons/fa";
import { TbDeviceAirpods } from "react-icons/tb";
import { IoWatchOutline } from "react-icons/io5";
import { BsLaptop } from "react-icons/bs";
import { HiMiniComputerDesktop } from "react-icons/hi2";
export default function HomeSidebar() {
    return (
        <>
            <div className="overflow-hidden rounded-lg w-[225px] h-[300px] shadow-[0_0_5px_5px] shadow-gray-300 mt-[10px]">
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    < MdOutlinePhoneIphone className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Điện thoại</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    < FaTabletAlt className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Tablet</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    <TbDeviceAirpods className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Âm thanh</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    <IoWatchOutline className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Đồng hồ</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    <BsLaptop className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Laptop</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    <FaTv className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Tivi</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
                <Link href="/mobile" className="mb-[5px] flex items-center hover:bg-gray-200 h-[35px] hover:text-red-600">
                    <HiMiniComputerDesktop className="w-[20px] h-[20px] ml-[20px] text-red-600" />
                    <p className="w-[140px] font-semibold text-[13px] ml-[10px]">Màn hình máy tính</p>
                    <MdKeyboardArrowRight className="w-[20px] h-[20px] text-black" />
                </Link>
            </div>
        </>
    )
}