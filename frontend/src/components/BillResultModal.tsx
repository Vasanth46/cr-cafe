import React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './BillPreviewModal.module.css';
import PrintableReceipt from './PrintableReceipt';
import TokenSlip from './TokenSlip';
import PrintableJob from './PrintableJob';


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
    let printContainer = document.getElementById('printable-receipt-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'printable-receipt-container';
      document.body.appendChild(printContainer);
    }
    const root = createRoot(printContainer);
    root.render(<PrintableJob bill={bill} order={bill.order} user={user} thought={randomThought}/>);
    setTimeout(() => {
      window.print();
      root.unmount();
      if (printContainer) {
        document.body.removeChild(printContainer);
      }
      onClose();
    }, 100);
  };

  const thoughts = [
    "Good food, good mood — every single time!",
    "Sip strong. Eat warm. Smile often.",
    "CR's Cafe — where mornings taste better.",
    "Happiness served hot & fresh.",
    "Brewed perfection, one order at a time.",
    "Because filter coffee > everything.",
    "Start your day the CR way.",
    "South Indian vibes in every bite.",
    "Hot dosas. Cool vibes.",
    "Refuel. Refresh. Rejoice.",
    "From kitchen to soul — pure delight.",
    "Made with love. Served with a smile.",
    "Life begins after coffee… or vada.",
    "One bite. Infinite smiles.",
    "Food so good, it deserves a slow clap.",
    "Powered by sambar & smiles.",
    "Cravings? Solved.",
    "Savor every sip, enjoy every bite.",
    "Breakfast isn't a meal — it's a ritual.",
    "We don’t just serve food, we serve comfort.",
    "Coffee brewed with kindness.",
    "You bring the appetite, we bring the soul.",
    "Wake up. Order up. Power up.",
    "Flavors from the South. Love from CR’s.",
    "Not just fast food — heartfelt food.",
    "Where idli meets inspiration.",
    "One cup. One plate. Endless stories.",
    "Every bill ends with a smile.",
    "CR’s Cafe — your neighborhood delight.",
    "You make it special. We just plate it."
  ];

// pick one thought (this keeps it constant per render)
  const randomThought = React.useMemo(() => {
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }, [bill?.receiptId]);


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
              <div style={{ marginBottom: '24px' }}>
                <PrintableReceipt bill={bill} order={bill.order} user={user} thought={randomThought}/>
              </div>
              <div>
                <TokenSlip bill={bill} order={bill.order} />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.billPreviewModal_btn} onClick={handlePrint}>
                Print Receipt & Token
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default BillResultModal;
