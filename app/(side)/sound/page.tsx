import ProductList from "../components/ProductList"
export default function Sound() {
    return (
        <>
            <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                <ProductList
                    title="Tai nghe"
                    categoryId={3}
                />
            </div>
        </>
    )
}