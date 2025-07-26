import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import styles from './Layout.module.css';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService'; // Import the service

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        // Fetch order count only if the user is a WORKER
        if (user && user.role === 'WORKER') {
            orderService.getMyTodaysOrderCount()
                .then(count => {
                    setOrderCount(count);
                })
                .catch(err => console.error("Failed to fetch order count", err));
        }
    }, [user]);

    const topBarUser = {
        name: user?.username || 'User',
        role: user?.role || 'WORKER',
        profileImageUrl: user?.profileImageUrl,
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
