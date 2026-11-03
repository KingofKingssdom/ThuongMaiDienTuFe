import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:7276/api";

export interface CreateOrderPayload {
    shippingFee: number;
    discountAmount: number;
    paymentMethod: number; // 1: Tiền mặt (COD), 2: Chuyển khoản / VNPay Online
    paymentStatus: number; // 0: Chưa thanh toán
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    note: string;
    selectedCartItemIds: number[];
}

// Gọi API tạo đơn hàng
export async function CreateOrderService(data: CreateOrderPayload, token: string) {
    try {
        const response = await axios.post(`${baseUrl}/Order`, data, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        throw error;
    }
}

export async function GetOrdersService(token: string) {
    try {
        const response = await axios.get(`${baseUrl}/Order`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        throw error;
    }
}

export async function GetVNPayPaymentUrlService(orderId: number, token: string) {
    try {
        const response = await axios.get(`${baseUrl}/payment/checkout/vnpay/${orderId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy link thanh toán VNPay:", error);
        throw error;
    }
}