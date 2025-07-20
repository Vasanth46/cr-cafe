import api from './api';
import type { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', { username, password });
  // Map backend response to expected shape and strip 'ROLE_' prefix
  const { token, id, username: uname, role } = res.data;
  const cleanRole = role.startsWith('ROLE_') ? role.replace('ROLE_', '') : role;
  return {
    token,
    user: { id: String(id), username: uname, role: cleanRole },
  };
};

const getProfile = async (token: string): Promise<User> => {
  const res = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default { login, getProfile }; 