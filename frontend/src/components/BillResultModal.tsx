import React, { useState } from 'react';
import styles from './BillPreviewModal.module.css';
import PrintableReceipt from './PrintableReceipt';

interface BillResultModalProps {
  open: boolean;
  bill: any;
  user: { username: string };
  onPrint: () => void;
  onClose: () => void;
}

const BillResultModal: React.FC<BillResultModalProps> = ({ open, bill, user, onPrint, onClose }) => {
  const [showPrint, setShowPrint] = useState(false);
  const handlePrint = () => {
    setShowPrint(true);
    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 100);
  };
  if (!open || !bill) return null;
  return (
    <>
      {showPrint && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999 }}>
          <PrintableReceipt bill={bill} order={bill.order} user={user} />
        </div>
      )}
      <div className={styles.billPreviewModal_overlay} style={showPrint ? { display: 'none' } : {}}>
        <div className={styles.modalCardScrollable}>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close"
          >
            ×
          </button>
          <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 20, color: '#375534', textAlign: 'center' }}>Bill Preview</div>
          <div className={styles.modalReceiptScroll}>
            <PrintableReceipt bill={bill} order={bill.order} user={user} />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.billPreviewModal_btn} onClick={handlePrint}>Print Receipt</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillResultModal; 