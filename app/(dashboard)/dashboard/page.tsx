export default function DashboardOverview() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng bạn đến trang Quản trị</h1>
            <p className="text-gray-500 text-sm mb-6">Chọn các chức năng ở menu bên trái để thực hiện thêm mới và quản lý dữ liệu.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Quản lý</p>
                    <h3 className="text-lg font-bold text-gray-800 mt-1">Sản phẩm & Biến thể</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Quản lý</p>
                    <h3 className="text-lg font-bold text-gray-800 mt-1">Thương hiệu (Brand)</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Quản lý</p>
                    <h3 className="text-lg font-bold text-gray-800 mt-1">Danh mục (Category)</h3>
                </div>
            </div>
        </div>
    );
}