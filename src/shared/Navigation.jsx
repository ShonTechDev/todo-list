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
    <nav aria-label="Main navigation">
      <ul className={styles['site-nav']}>
        <li>
          <NavLink to="/about" className={getNavLinkClassName}>
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={getNavLinkClassName}>
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className={getNavLinkClassName}>
                Profile
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.button} ${styles['button--ghost']}`}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={getNavLinkClassName}>
              Log In
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;