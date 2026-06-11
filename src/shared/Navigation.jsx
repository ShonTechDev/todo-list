import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navigation() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav>
      <NavLink to="/about">About</NavLink>

      {token ? (
        <>
          <NavLink to="/todos">Todos</NavLink>
          <NavLink to="/profile">Profile</NavLink>

          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </>
      ) : (
        <NavLink to="/login">Log In</NavLink>
      )}
    </nav>
  );
}

export default Navigation;