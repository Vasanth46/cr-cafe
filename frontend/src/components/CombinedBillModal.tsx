import React from 'react';
import { createRoot } from 'react-dom/client';
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
  if (!open || !bill) return null;

  const handlePrint = () => {
    // 1. Find or create a dedicated container for printing at the top level
    let printContainer = document.getElementById('printable-receipt-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'printable-receipt-container';
      document.body.appendChild(printContainer);
    }

    // 2. Render the receipt into the container using a React 18+ portal
    const root = createRoot(printContainer);
    root.render(<PrintableReceipt bill={bill} order={bill.order} user={user} />);

    // 3. Print after a short delay to ensure the DOM is updated
    setTimeout(() => {
      window.print();

      // 4. Clean up the container from the DOM after printing
      root.unmount();
      if (printContainer) {
        document.body.removeChild(printContainer);
      }

      // 5. Automatically close the modal
      onClose();
    }, 100);
  };

  return (
    <>
      <div className={styles.billPreviewModal_overlay}>
        <div className={styles.modalCardScrollable}>
          <button onClick={onClose} className={styles.modalCloseBtn} aria-label="Close">
            ×
          </button>
          <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 20, color: '#375534', textAlign: 'center' }}>
            Bill Preview
          </div>
          <div className={styles.modalReceiptScroll}>
            <PrintableReceipt bill={bill} order={bill.order} user={user} />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.billPreviewModal_btn} onClick={handlePrint}>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillResultModal;
