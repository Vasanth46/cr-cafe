import api from './api';
import type { MenuItem } from '../types';

const getItems = async (): Promise<MenuItem[]> => {
  const res = await api.get('/items');
  return res.data;
};

export default { getItems }; 