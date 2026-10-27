import ProductList from "../components/ProductList"
export default function Watch() {
    return (
        <>
            <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                <ProductList
                    title="Đồng hồ"
                    categoryId={4}
                />
            </div>
        </>
    )
}