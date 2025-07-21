import React from 'react';
import TopBar, { TopBarProps } from './TopBar';

interface LayoutProps extends TopBarProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ orderCount, user, children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#E3EED4' }}>
      <TopBar orderCount={orderCount} user={user} />
      <main style={{ flex: 1, width: '100%' }}>{children}</main>
    </div>
  );
};

export default Layout; 