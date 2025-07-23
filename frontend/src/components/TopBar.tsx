import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import styles from './TopBar.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

export interface TopBarProps {
  orderCount: number;
  user: { name: string; role: string; email?: string };
}

const TopBar: React.FC<TopBarProps> = ({ orderCount, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login');
  };
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  return (
      <div className={styles.topBar_root}>
        <div className={styles.topBar_left}>
          <img src={logo} alt="CR's Cafe Logo" className={styles.topBar_logo} />
          <div className={styles.topBar_brand}>
            <span className={styles.topBar_title}>CR's Cafe</span>
            <span className={styles.topBar_date}>{today}</span>
          </div>
        </div>
        <div className={styles.topBar_center}></div>
        <div className={styles.topBar_right}>
          {user.role !== 'OWNER' && (
              <span className={styles.topBar_orders}>Total : {orderCount} Orders</span>
          )}
          <button className={styles.topBar_report}>Report</button>
          <span className={styles.topBar_notification}>🔔</span>
          <div className={styles.topBar_profile} onClick={() => setShowProfileMenu(v => !v)} style={{ cursor: 'pointer', position: 'relative' }}>
            <div className={styles.topBar_avatar}>{user.name[0]}</div>
            {showProfileMenu && (
                <div className={styles.topBar_profileMenu} ref={profileMenuRef}>
                  <div className={styles.topBar_profileMenuName}>{user.name}</div>
                  <div className={styles.topBar_profileMenuDivider} />
                  <button className={styles.topBar_profileMenuLogout} onClick={handleLogout}>
                    Log Out <span style={{ marginLeft: '0.7rem', display: 'flex', alignItems: 'center' }}><FiLogOut /></span>
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default TopBar;

