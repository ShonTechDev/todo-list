import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClassName = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link--active' : ''}`;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
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
            className="button button--ghost"
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