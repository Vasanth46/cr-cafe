import React from 'react';
import logo from '../assets/logo.jpg';
import styles from './TopBar.module.css';

interface TopBarProps {
  orderCount: number;
  user: { name: string; role: string };
}

const TopBar: React.FC<TopBarProps> = ({ orderCount, user }) => {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div className={styles.topBar_root}>
      <div className={styles.topBar_left}>
        <img src={logo} alt="CR's Cafe Logo" className={styles.topBar_logo} />
        <span className={styles.topBar_date}>{today}</span>
      </div>
      <div className={styles.topBar_center}></div>
      <div className={styles.topBar_right}>
        <span className={styles.topBar_orders}>Total : {orderCount} Orders</span>
        <button className={styles.topBar_report}>Report</button>
        <span className={styles.topBar_notification}>🔔</span>
        <div className={styles.topBar_profile}>
          <div className={styles.topBar_avatar}>{user.name[0]}</div>
          <div>
            <div className={styles.topBar_profileName}>{user.name}</div>
            <div className={styles.topBar_profileRole}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 