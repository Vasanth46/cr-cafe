import React from 'react';
import PrintableReceipt from './PrintableReceipt';
import TokenSlip from './TokenSlip';

interface PrintableJobProps {
  bill: any;
  order: any;
  user: { username: string };
}

const PrintableJob: React.FC<PrintableJobProps> = ({ bill, order, user }) => {
  return (
    <>
      <PrintableReceipt bill={bill} order={order} user={user} />
      <TokenSlip bill={bill} order={order} />
    </>
  );
};

export default PrintableJob; 