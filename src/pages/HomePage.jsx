import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from '../App.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className={styles.page}>
      <div className={styles['page-card']}>
        <p className={styles['loading-state']}>Redirecting...</p>
      </div>
    </section>
  );
}

export default HomePage;