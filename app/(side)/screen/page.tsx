import ProductList from "../components/ProductList";
export default function Screen() {
    return (
        <div className="mx-auto w-[98%] lg:w-[80%] 2xl:w-[70%]">
            <ProductList
                title="Màn hình"
                categoryId={6}
            />
        </div>
    )
}