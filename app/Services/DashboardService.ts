import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:7276/api";

export async function GetDashboardStatsService(token: string) {
    try {
        const response = await axios.get(`${baseUrl}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
        throw error;
    }
}