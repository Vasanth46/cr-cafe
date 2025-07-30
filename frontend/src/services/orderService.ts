import api from './api';
import type { OrderRequestDto, OrderResponseDto, BillResponseDto } from '../types';
import { PaymentMode } from '../types';

const createOrder = async (orderData: OrderRequestDto): Promise<OrderResponseDto> => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error('Failed to create order. Please try again.');
    }
};

const generateBill = async (orderId: number, discountId?: number, paymentMode: PaymentMode = PaymentMode.CASH): Promise<BillResponseDto> => {
    try {
        const response = await api.post(`/orders/${orderId}/bill`, null, { params: { discountId, paymentMode } });
        return response.data;
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error('Failed to generate bill. Please try again.');
    }
};

const getMyTodaysOrderCount = async (): Promise<number> => {
    const response = await api.get('/orders/my-day-count');
    return response.data;
};

export default {
    createOrder,
    generateBill,
    getMyTodaysOrderCount
}; 