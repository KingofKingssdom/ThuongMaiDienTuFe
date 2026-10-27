import ProductList from "../components/ProductList"
export default function Tablet() {
    return (
        <>
            <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                <ProductList
                    title="Tablet"
                    categoryId={2}
                />
            </div>
        </>
    )

}