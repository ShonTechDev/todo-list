import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { token, logout } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {token && (
        <button type="button" onClick={logout}>
          Log Out
        </button>
      )}
    </header>
  );
}

export default Header;