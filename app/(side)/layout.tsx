"use client"
import Header from "./components/Header";
import Footer from "./components/Footer";
import Secondary from "./components/SecondaryNav";
import HomeSidebar from "./components/HomeSidebar";
import { useState } from "react";
export default function SiteLayout({ children }: any) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    return (
        <>
            <div className="sticky top-0 z-[100]">
                <Header />

            </div>

            <main className="pb-[60px]">{children}</main>
            <div className="hidden md:block">
                <Footer />
            </div>
            <div className="block md:hidden fixed bottom-0 left-0 right-0 z-[100] rounded-t-2xl">
                <Secondary onOpenCategory={() => setIsCategoryOpen(true)} />
            </div>

            <HomeSidebar
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
            />
        </>

    );
}
