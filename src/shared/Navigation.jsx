import { NavLink, useNavigate } from 'react-router';
import styles from '../App.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClassName = ({ isActive }) =>
    isActive
      ? `${styles['nav-link']} ${styles['nav-link--active']}`
      : styles['nav-link'];

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className={styles['site-nav']} aria-label="Main navigation">
      <NavLink to="/about" className={getNavLinkClassName}>
        About
      </NavLink>

      {isAuthenticated ? (
        <>
          <NavLink to="/todos" className={getNavLinkClassName}>
            Todos
          </NavLink>

          <NavLink to="/profile" className={getNavLinkClassName}>
            Profile
          </NavLink>

          <button
            type="button"
            className={`${styles.button} ${styles['button--ghost']}`}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </>
      ) : (
        <NavLink to="/login" className={getNavLinkClassName}>
          Log In
        </NavLink>
      )}
    </nav>
  );
}

export default Navigation;