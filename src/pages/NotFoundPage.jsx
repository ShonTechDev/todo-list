import { Link } from 'react-router';
import styles from '../App.module.css';

function NotFoundPage() {
  return (
    <section className={`${styles.page} ${styles['not-found-page']}`}>
      <div className={styles['page-card']}>
        <div className={styles['page-heading']}>
          <p className={styles['page-heading__eyebrow']}>Page not found</p>
          <h2>404 - Page Not Found</h2>

          <p>The page you are looking for does not exist.</p>
        </div>

        <div className={styles['button-row']}>
          <Link className={styles.button} to="/about">
            Go to About
          </Link>

          <Link className={styles.button} to="/login">
            Go to Login
          </Link>

          <Link
            className={`${styles.button} ${styles['button--ghost']}`}
            to="/todos"
          >
            Go to Todos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;