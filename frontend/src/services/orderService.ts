import api from './api';
import type { Order } from '../types';

interface CreateOrderPayload {
  userId: number;
  items: { itemId: string; quantity: number; }[];
  customerName?: string;
  table?: string;
}

const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const res = await api.post('/orders', payload);
  return res.data;
};

const generateBill = async (orderId: string | number, discountId?: string | number) => {
  const url = discountId ? `/orders/${orderId}/bill?discountId=${discountId}` : `/orders/${orderId}/bill`;
  const res = await api.post(url);
  return res.data;
};

export default { createOrder, generateBill }; 