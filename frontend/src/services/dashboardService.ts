import api from './api';

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

export const getRecentTransactions = async () => {
  const res = await api.get('/dashboard/recent-transactions');
  return res.data;
};

export default { getSummary, getTopItems, getRevenue, getRecentTransactions }; 