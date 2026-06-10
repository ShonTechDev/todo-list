import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { token, logout } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      <nav>
        <NavLink to="/about">About</NavLink>

        {token ? (
          <>
            <NavLink to="/todos">Todos</NavLink>
            <NavLink to="/profile">Profile</NavLink>

            <button type="button" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <NavLink to="/login">Log In</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;