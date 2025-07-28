import React from 'react';
import styles from './TokenSlip.module.css';

interface TokenSlipProps {
    bill: any;
    order: any;
}

const TokenSlip: React.FC<TokenSlipProps> = ({ bill, order }) => {
    return (
        <div className={styles.tokenSlipRoot + ' ' + styles.pageBreak}>
            <div className={styles.tokenHeader}>
                <div className={styles.tokenCafeTitle}>CR's Cafe Token</div>
            </div>
            <hr className={styles.tokenHr} />
            <div className={styles.tokenId}>{bill.receiptId}</div>

            {/* Token Items Header */}
            <div className={styles.tokenItemsHeader}>
                <div className={styles.tokenItemName}>Item</div>
                <div className={styles.tokenItemQty}>Qty</div>
            </div>
            <hr className={styles.tokenHr} />

            {/* Token Items List */}
            <div className={styles.tokenItems}>
                {order.orderItems.map((oi: any) => (
                    <div className={styles.tokenItemRow} key={oi.id}>
                        <div className={styles.tokenItemName}>{oi.item.name}</div>
                        <div className={styles.tokenItemQty}>{oi.quantity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TokenSlip; 