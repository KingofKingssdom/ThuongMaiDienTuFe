import ProductList from "../components/ProductList";
export default function Television() {
    return (
        <>
            <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
                <ProductList
                    title="Tivi"
                    categoryId={5}
                />
            </div>
        </>
    )
}

