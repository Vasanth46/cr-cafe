import React from 'react';
import type { OrderItem } from '../types';
import styles from './BillPreviewModal.module.css';

interface BillPreviewModalProps {
  open: boolean;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

const BillPreviewModal: React.FC<BillPreviewModalProps> = ({ open, orderItems, subtotal, tax, total, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className={styles.billPreviewModal_overlay}>
      <div className={styles.billPreviewModal_card}>
        <div className={styles.billPreviewModal_title}>Bill Preview</div>
        <div className={styles.billPreviewModal_list}>
          {orderItems.map(oi => (
            <div key={oi.item.id} className={styles.billPreviewModal_item}>
              <div>
                <div className={styles.billPreviewModal_itemName}>{oi.item.name}</div>
                <div className={styles.billPreviewModal_itemQty}>x{oi.quantity}</div>
              </div>
              <div className={styles.billPreviewModal_itemTotal}>₹{(oi.item.price * oi.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className={styles.billPreviewModal_totals}>
          <div className={styles.billPreviewModal_totalRow}>
            <span className={styles.billPreviewModal_totalLabel}>Subtotal</span>
            <span className={styles.billPreviewModal_totalValue}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.billPreviewModal_totalRow}>
            <span className={styles.billPreviewModal_totalLabel}>Tax</span>
            <span className={styles.billPreviewModal_totalValue}>₹{tax.toFixed(2)}</span>
          </div>
          <div className={styles.billPreviewModal_totalRow}>
            <span className={styles.billPreviewModal_totalLabel}>Total</span>
            <span className={styles.billPreviewModal_totalValue}>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.billPreviewModal_actions}>
          <button
            className={`${styles.billPreviewModal_btn} ${styles['billPreviewModal_btn--cancel']}`}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`${styles.billPreviewModal_btn} ${styles['billPreviewModal_btn--confirm']}`}
            onClick={onConfirm}
          >
            Confirm & Generate
          </button>
        </div>

      </div>
    </div>
  );
};

export default BillPreviewModal; 