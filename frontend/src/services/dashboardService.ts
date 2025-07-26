import api from './api';
import type { RecentTransaction } from "../types";

export const getSummary = async () => {
  const res = await api.get('/dashboard/summary');
  return res.data;
};

export const getTopItems = async () => {
  const res = await api.get('/dashboard/top-items');
  return res.data;
};

export const getRevenue = async (range: string) => {
  const res = await api.get(`/dashboard/revenue?range=${range}`);
  return res.data;
};

// export const getRecentTransactions = async () => {
//   const res = await api.get('/dashboard/recent-transactions');
//   return res.data;
// };

export const getRecentTransactions = async (): Promise<RecentTransaction[]> => {
  const res = await api.get('/dashboard/recent-transactions');
  return res.data;
};
export const getRecentTransactionsPaginated = async (page: number = 1, size: number = 10) => {
  const res = await api.get(`/dashboard/recent-transactions/paginated?page=${page}&size=${size}`);
  return res.data;
};
export const getRecentTransactionsWithFilters = async (
  page: number = 1, 
  size: number = 10,
  filters: {
    cashier?: string;
    minValue?: number;
    maxValue?: number;
    startDate?: string;
    endDate?: string;
    paymentMode?: string;
  }
) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  if (filters.cashier) params.append('cashier', filters.cashier);
  if (filters.minValue) params.append('minValue', filters.minValue.toString());
  if (filters.maxValue) params.append('maxValue', filters.maxValue.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.paymentMode) params.append('paymentMode', filters.paymentMode);
  
  const res = await api.get(`/dashboard/recent-transactions/filtered?${params.toString()}`);
  return res.data;
};

export const getAllCashiers = async () => {
  const res = await api.get('/dashboard/cashiers');
  return res.data;
};
export const getUsersPerformance = async (range: string) => {

  const res = await api.get(`/dashboard/users-performance?range=${range}`);
  return res.data;
};

export const getTodaysRevenueByPaymentMode = async () => {
  const res = await api.get('/dashboard/todays-revenue-by-payment-mode');
  return res.data;
};

export default { getSummary, getTopItems, getRevenue, getRecentTransactions, getUsersPerformance, getTodaysRevenueByPaymentMode, getRecentTransactionsPaginated, getRecentTransactionsWithFilters, getAllCashiers };