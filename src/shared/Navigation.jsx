import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
  });

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav>
      <NavLink to="/about" style={navLinkStyles}>
        About
      </NavLink>

      {isAuthenticated ? (
        <>
          <NavLink to="/todos" style={navLinkStyles}>
            Todos
          </NavLink>

          <NavLink to="/profile" style={navLinkStyles}>
            Profile
          </NavLink>

          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </>
      ) : (
        <NavLink to="/login" style={navLinkStyles}>
          Log In
        </NavLink>
      )}
    </nav>
  );
}

export default Navigation;