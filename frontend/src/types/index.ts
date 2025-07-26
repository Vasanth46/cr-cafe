// Global TypeScript types and interfaces for the POS Café App

export enum PaymentMode {
  CASH = 'CASH',
  ONLINE = 'ONLINE'
}

export interface User {
  id: string;
  username: string;
  role: 'OWNER' | 'MANAGER' | 'WORKER';
  profileImageUrl?: string | null; // <-- ADD THIS LINE
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

export interface Bill {
  id: number;
  order: any;
  billDate: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  receiptId: string;
  paymentMode: PaymentMode;
}

export interface RecentTransaction {
  user_id: string;
  handled_by: string;
  order_id: string;
  receipt_id: string;
  final_amount: number;
  date: string; // or `Date` if you're parsing it on frontend
}
