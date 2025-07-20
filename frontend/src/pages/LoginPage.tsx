import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { login, loading, error, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/menu');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!username || !password) {
      setFormError('Please enter both username and password.');
      return;
    }
    await login(username, password);
  };

  return (
    <div className={styles.loginPage_root}>
      <div className={styles.loginPage_card}>
        <div className={styles.loginPage_title}>CRs Cafe</div>
        <div className={styles.loginPage_subtitle}>Sign in to your account</div>
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
          {(formError || error) && (
            <div className={styles.loginPage_error}>{formError || error}</div>
          )}
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
  );
};

export default LoginPage; 