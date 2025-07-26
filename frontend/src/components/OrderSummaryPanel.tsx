import React from 'react';
import { FaTrash } from 'react-icons/fa';
import type { OrderItem } from '../types';
import { PaymentMode } from '../types';
import styles from './OrderSummaryPanel.module.css';

interface OrderSummaryPanelProps {
  orderItems: OrderItem[];
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onGenerateBill: () => void;
  generating?: boolean;
  customerName: string;
  onCustomerNameChange: (v: string) => void;
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({ 
  orderItems, 
  onRemove, 
  onUpdateQuantity, 
  onGenerateBill, 
  generating, 
  customerName, 
  onCustomerNameChange,
  paymentMode,
  onPaymentModeChange
}) => {
  const subtotal = orderItems.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0);
  const discount = 0; // For now, discount is 0
  const total = subtotal - discount;

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
      
      {/* Payment Mode Selection */}
      <div className={styles.orderSummary_paymentMode}>
        <div className={styles.orderSummary_paymentModeTitle}>Payment Mode:</div>
        <div className={styles.orderSummary_paymentModeOptions}>
          <label className={styles.orderSummary_paymentModeOption}>
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.CASH}
              checked={paymentMode === PaymentMode.CASH}
              onChange={(e) => onPaymentModeChange(e.target.value as PaymentMode)}
            />
            <span>Cash</span>
          </label>
          <label className={styles.orderSummary_paymentModeOption}>
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.ONLINE}
              checked={paymentMode === PaymentMode.ONLINE}
              onChange={(e) => onPaymentModeChange(e.target.value as PaymentMode)}
            />
            <span>Online</span>
          </label>
        </div>
      </div>
      
      <div className={styles.orderSummary_list}>
        {orderItems.map(oi => (
          <div key={oi.item.id} className={styles.orderSummary_item}>
            <div className={styles.orderSummary_itemInfo}>
              <div className={styles.orderSummary_itemName}>{oi.item.name}</div>
              <div className={styles.orderSummary_itemPrice}>₹{oi.item.price.toFixed(2)}</div>
            </div>
            <div className={styles.orderSummary_itemActions}>
              <button
                className={styles.orderSummary_quantityBtn}
                onClick={() => onUpdateQuantity(oi.item.id, oi.quantity - 1)}
                disabled={oi.quantity <= 1}
              >
                -
              </button>
              <span className={styles.orderSummary_quantity}>{oi.quantity}</span>
              <button
                className={styles.orderSummary_quantityBtn}
                onClick={() => onUpdateQuantity(oi.item.id, oi.quantity + 1)}
              >
                +
              </button>
              <button
                className={styles.orderSummary_removeBtn}
                onClick={() => onRemove(oi.item.id)}
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.orderSummary_totals}>
        <div className={styles.orderSummary_totalRow}>
          <span className={styles.orderSummary_totalLabel}>Subtotal</span>
          <span className={styles.orderSummary_totalValue}>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.orderSummary_totalRow}>
          <span className={styles.orderSummary_totalLabel}>Discount</span>
          <span className={styles.orderSummary_totalValue}>₹{discount.toFixed(2)}</span>
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