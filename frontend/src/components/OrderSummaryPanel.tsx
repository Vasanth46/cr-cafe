import React from 'react';
import type { OrderItem } from '../types';
import styles from './OrderSummaryPanel.module.css';

interface OrderSummaryPanelProps {
  orderItems: OrderItem[];
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onGenerateBill: () => void;
  generating?: boolean;
  customerName: string;
  onCustomerNameChange: (v: string) => void;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({ orderItems, onRemove, onUpdateQuantity, onGenerateBill, generating, customerName, onCustomerNameChange }) => {
  const subtotal = orderItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0);
  const tax = subtotal * 0.1; // Example: 10% tax
  const total = subtotal + tax;

  return (
    <div className={styles.orderSummary_root}>
      <div className={styles.orderSummary_title}>Order Summary</div>
      <div className={styles.orderSummary_inputs}>
        <input
          type="text"
          placeholder="Customer name"
          className={styles.orderSummary_input}
          value={customerName}
          onChange={e => onCustomerNameChange(e.target.value)}
        />
      </div>
      <div className={styles.orderSummary_list}>
        {orderItems.length === 0 ? (
          <div className={styles.orderSummary_itemPrice}>No items selected.</div>
        ) : (
          orderItems.map(oi => (
            <div key={oi.item.id} className={styles.orderSummary_item}>
              <div>
                <div className={styles.orderSummary_itemName}>{oi.item.name}</div>
                <div className={styles.orderSummary_itemPrice}>₹{oi.item.price.toFixed(2)} x </div>
              </div>
              <div className={styles.orderSummary_itemControls}>
                <button
                  className={styles.orderSummary_quantityBtn}
                  onClick={() => onUpdateQuantity(oi.item.id, Math.max(1, oi.quantity - 1))}
                  disabled={oi.quantity <= 1}
                >-</button>
                <span>{oi.quantity}</span>
                <button
                  className={styles.orderSummary_quantityBtn}
                  onClick={() => onUpdateQuantity(oi.item.id, oi.quantity + 1)}
                >+</button>
                <span className={styles.orderSummary_itemPrice}>₹{(oi.item.price * oi.quantity).toFixed(2)}</span>
                <button
                  className={styles.orderSummary_removeBtn}
                  onClick={() => onRemove(oi.item.id)}
                  aria-label={`Delete ${oi.item.name}`}
                  title="Delete"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="#e53935" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 2.5C7.5 1.94772 7.94772 1.5 8.5 1.5H11.5C12.0523 1.5 12.5 1.94772 12.5 2.5V3.5H16C16.2761 3.5 16.5 3.72386 16.5 4C16.5 4.27614 16.2761 4.5 16 4.5H4C3.72386 4.5 3.5 4.27614 3.5 4C3.5 3.72386 3.72386 3.5 4 3.5H7.5V2.5ZM5.5 6V16.5C5.5 17.0523 5.94772 17.5 6.5 17.5H13.5C14.0523 17.5 14.5 17.0523 14.5 16.5V6H5.5ZM8.5 8.5C8.22386 8.5 8 8.72386 8 9V15C8 15.2761 8.22386 15.5 8.5 15.5C8.77614 15.5 9 15.2761 9 15V9C9 8.72386 8.77614 8.5 8.5 8.5ZM11.5 8.5C11.2239 8.5 11 8.72386 11 9V15C11 15.2761 11.2239 15.5 11.5 15.5C11.7761 15.5 12 15.2761 12 15V9C12 8.72386 11.7761 8.5 11.5 8.5Z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.orderSummary_totals}>
        <div className={styles.orderSummary_totalRow}>
          <span className={styles.orderSummary_totalLabel}>Subtotal</span>
          <span className={styles.orderSummary_totalValue}>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.orderSummary_totalRow}>
          <span className={styles.orderSummary_totalLabel}>Tax</span>
          <span className={styles.orderSummary_totalValue}>₹{tax.toFixed(2)}</span>
        </div>
        <div className={styles.orderSummary_totalRow}>
          <span className={styles.orderSummary_totalLabel}>Total</span>
          <span className={styles.orderSummary_totalValue}>₹{total.toFixed(2)}</span>
        </div>
        <button
          className={styles.orderSummary_generateBtn}
          onClick={onGenerateBill}
          disabled={orderItems.length === 0 || generating}
        >
          {generating ? 'Generating...' : 'Generate Bill'}
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPanel; 