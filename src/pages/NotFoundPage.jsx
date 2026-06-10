import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>

      <p>The page you are looking for does not exist.</p>

      <ul>
        <li>
          <Link to="/about">Go to About</Link>
        </li>
        <li>
          <Link to="/login">Go to Login</Link>
        </li>
        <li>
          <Link to="/todos">Go to Todos</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;