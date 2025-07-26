import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import character from '../assets/character.png';
import { useToaster } from '../components/Toaster';

const LoginPage: React.FC = () => {
  const { login, loading, error, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToaster();

  React.useEffect(() => {
    if (user) {
      showToast('Login successful!', 'success');
      if (user.role === 'OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/menu');
      }
    }
  }, [user, navigate, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!username || !password) {
      setFormError('Please enter both username and password.');
      showToast('Please enter both username and password.', 'error');
      return;
    }
    await login(username, password);
  };

  return (
    <div className={styles.loginPage_outer}>
      <div className={styles.loginPage_bgBlob1}></div>
      <div className={styles.loginPage_bgBlob2}></div>
      <div className={styles.loginPage_bgBlob3}></div>
      <div className={styles.loginPage_bgBlob4}></div>
      <div className={styles.loginPage_bgBlob5}></div>
      <div className={styles.loginPage_glassBg}></div>
      <div className={styles.loginPage_cardRow}>
        <div className={styles.loginPage_cardImageSection}>
          <img src={character} alt="Cafe Character" className={styles.loginPage_cardImg} />
        </div>
        <div className={styles.loginPage_cardFormSection}>
          <div className={styles.loginPage_bannerLogo}>CRs Cafe</div>
          <div className={styles.loginPage_title}>Sign in to your account</div>
          <form onSubmit={handleSubmit}>
            <label className={styles.loginPage_label}>Username</label>
            <input
              type="text"
              className={styles.loginPage_input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
            <label className={styles.loginPage_label}>Password</label>
            <input
              type="password"
              className={styles.loginPage_input}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {(formError || error) && null}
            <button
              type="submit"
              className={styles.loginPage_button}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 