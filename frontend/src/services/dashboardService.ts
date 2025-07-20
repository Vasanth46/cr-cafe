import api from './api';

export const getSummary = async () => {
  const res = await api.get('/summary');
  return res.data;
};

export const getTopItems = async () => {
  const res = await api.get('/top-items');
  return res.data;
};

export const getRevenue = async (range: string) => {
  const res = await api.get(`/revenue?range=${range}`);
  return res.data;
};

export default { getSummary, getTopItems, getRevenue }; 