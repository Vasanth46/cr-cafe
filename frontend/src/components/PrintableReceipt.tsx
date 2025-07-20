import React from 'react';
import logo from '../assets/logo.jpg';
import styles from './PrintableReceipt.module.css';

interface PrintableReceiptProps {
  bill: any;
  order: any;
  user: { username: string };
}

const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ bill, order, user }) => {
  return (
    <div className={styles.receiptPrintRoot}>
      <div className={styles.receiptLogoWrap}>
        <img src={logo} alt="CR's Cafe Logo" className={styles.receiptLogo} />
      </div>
      <div className={styles.receiptHeader}>
        <div className={styles.receiptTitle}>CR's Cafe</div>
        <div>123 Cafe Lane, Mumbai</div>
        <div>Phone: +91 98765 43210</div>
        <div>GSTIN: XXXXXXXXXXXXXXXX</div>
      </div>
      <hr className={styles.receiptHr} />
      <div className={styles.receiptInfo}>
        <div>Receipt: {bill.receiptId}</div>
        <div>Date: {new Date(bill.billDate).toLocaleString()}</div>
        <div>Cashier: {user.username}</div>
      </div>
      <hr className={styles.receiptHr} />
      <div className={styles.receiptItems}>
        {order.orderItems.map((oi: any) => (
          <div className={styles.receiptItemRow} key={oi.id}>
            <span>{oi.item.name} (x{oi.quantity})</span>
            <span>₹{oi.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr className={styles.receiptHr} />
      <div className={styles.receiptTotals}>
        <div className={styles.receiptTotalRow}>
          <span>Subtotal</span>
          <span>₹{bill.totalAmount?.toFixed(2)}</span>
        </div>
        <div className={styles.receiptTotalRow}>
          <span>Discount</span>
          <span>-₹{bill.discount?.toFixed(2)}</span>
        </div>
        <div className={styles.receiptTotalRowBold}>
          <span>TOTAL</span>
          <span>₹{bill.finalAmount?.toFixed(2)}</span>
        </div>
      </div>
      <hr className={styles.receiptHr} />
      <div className={styles.receiptFooter}>
        <div>Thank you for your visit!</div>
        <div>This receipt is your token.</div>
      </div>
    </div>
  );
};

export default PrintableReceipt; 