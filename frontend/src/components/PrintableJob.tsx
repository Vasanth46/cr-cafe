import React from 'react';
import PrintableReceipt from './PrintableReceipt';
import TokenSlip from './TokenSlip';

interface PrintableJobProps {
    bill: any;
    order: any;
    user: { username: string };
    thought: string;
}

const PrintableJob: React.FC<PrintableJobProps> = ({ bill, order, user,thought }) => {
    return (
        <>
            <PrintableReceipt bill={bill} order={order} user={user} thought={thought}/>
            <TokenSlip bill={bill} order={order} />
        </>
    );
};

export default PrintableJob;

