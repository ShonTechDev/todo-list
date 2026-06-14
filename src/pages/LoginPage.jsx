import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from '../App.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import Logon from '../features/Logon.jsx';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <section className={`${styles.page} ${styles['login-page']}`}>
      <div className={styles['page-card']}>
        <div className={styles['page-heading']}>
          <p className={styles['page-heading__eyebrow']}>Welcome back</p>
          <h2>Log In</h2>
          <p>Log in to view and manage your personal todo list.</p>
        </div>

        <Logon />
      </div>
    </section>
  );
}

export default LoginPage;