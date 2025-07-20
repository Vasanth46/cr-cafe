// Global TypeScript types and interfaces for the POS Café App

export interface User {
  id: string;
  username: string;
  role: 'WORKER' | 'MANAGER' | 'OWNER';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  category: string;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  total: number;
  createdAt: string;
  customerName?: string;
  table?: string;
} 