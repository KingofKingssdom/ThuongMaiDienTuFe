"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "../Services/AuthSerivce";

// Hàm phụ để giải mã role từ chuỗi JWT (nếu backend không trả về thẳng trường role ngoài object)
function getRoleFromToken(token: string): string {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        // Claim chuẩn của .NET cho Role thường có dạng dài như sau:
        const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        return decodedPayload[roleKey] || decodedPayload.role || "User";
    } catch (e) {
        return "User";
    }
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Form Login states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Form Register states
    const [fullName, setFullName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    // Xử lý Đăng nhập
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const res = await AuthService.login({ email, password });

            // Kiểm tra xem API gọi thành công và có data trả về không
            if (res.success && res.data) {
                const { accessToken, user } = res.data;

                // 1. Lưu AccessToken vào localStorage
                localStorage.setItem("token", accessToken);
                if (user?.fullName) {
                    localStorage.setItem("userName", user.fullName);
                }

                // 2. Lấy Role (ưu tiên lấy từ object user nếu có, nếu không thì bóc từ token JWT)
                const role = user?.role || getRoleFromToken(accessToken);

                // 3. Phân quyền chuyển hướng dựa vào Role
                if (role.toLowerCase() === "admin") {
                    router.push("/dashboard"); // Chuyển đến trang Admin
                } else {
                    router.push("/"); // Về trang chủ cho User thường
                }
            } else {
                setErrorMessage(res.message || "Đăng nhập thất bại.");
            }
        } catch (error: any) {
            console.error("Lỗi đăng nhập:", error);
            setErrorMessage(error?.response?.data?.message || "Email hoặc mật khẩu không chính xác.");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Đăng ký
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const res = await AuthService.register({
                fullName,
                email: regEmail,
                password: regPassword
            });

            if (res.success !== false) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                setIsLogin(true); // Chuyển về màn hình login
            } else {
                setErrorMessage(res.message || "Đăng ký thất bại.");
            }
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            setErrorMessage(error?.response?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLogin ? "Đăng nhập hệ thống" : "Tạo tài khoản mới"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLogin ? "Chào mừng trở lại!" : "Điền thông tin để đăng ký."}
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="cam@gmail.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Trần Thị C"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                placeholder="cam@gmail.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                required
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }}
                            className="text-red-600 font-semibold hover:underline cursor-pointer"
                        >
                            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
                        </button>
                    </p>
                </div>

                <div className="text-center mt-4">
                    <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
                        ← Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}