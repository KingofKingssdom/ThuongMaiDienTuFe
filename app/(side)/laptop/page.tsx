import ProductList from "../components/ProductList"
export default function Laptop() {
    return (
        <>
            <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                <ProductList
                    title="Laptop"
                    categoryId={7}
                />
            </div>
        </>
    )
}