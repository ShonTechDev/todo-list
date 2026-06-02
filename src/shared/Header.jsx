import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { token, logoff } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {token && (
        <button type="button" onClick={logoff}>
          Log Out
        </button>
      )}
    </header>
  );
}

export default Header;