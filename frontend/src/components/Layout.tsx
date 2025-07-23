import React from 'react';
import TopBar, { TopBarProps } from './TopBar'; // Adjust path if needed
import styles from './Layout.module.css';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

interface LayoutProps {
    children: React.ReactNode;
    orderCount?: number; // Make orderCount optional
}

const Layout: React.FC<LayoutProps> = ({ children, orderCount = 0 }) => {
    const { user } = useAuth();

    // Prepare user data for the TopBar
    const topBarUser = {
        name: user?.username || 'User',
        role: user?.role || 'WORKER',
        profileImageUrl: user?.profileImageUrl, // Pass the image URL
    };

    return (
        <div className={styles.layoutRoot}>
            <TopBar orderCount={orderCount} user={topBarUser} />
            <main className={styles.contentArea}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
