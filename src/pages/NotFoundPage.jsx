import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section className="page not-found-page">
      <div className="page-card">
        <div className="page-heading">
          <p className="page-heading__eyebrow">Page not found</p>
          <h2>404 - Page Not Found</h2>

          <p>The page you are looking for does not exist.</p>
        </div>

        <div className="button-row">
          <Link className="button" to="/about">
            Go to About
          </Link>

          <Link className="button" to="/login">
            Go to Login
          </Link>

          <Link className="button button--ghost" to="/todos">
            Go to Todos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;