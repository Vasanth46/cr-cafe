// Global TypeScript types and interfaces for the POS Café App

export const PaymentMode = {
  CASH: 'CASH',
  ONLINE: 'ONLINE'
} as const;

export type PaymentMode = typeof PaymentMode[keyof typeof PaymentMode];

// Add missing DTO types
export interface OrderRequestDto {
  userId: number;
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
  customerName?: string;
  table?: string;
}

export interface OrderResponseDto {
  id: number;
  user: User;
  orderDate: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface BillResponseDto {
  id: number;
  order: OrderResponseDto;
  billDate: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  receiptId: string;
  paymentMode: PaymentMode;
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
