import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoList, setTodoList] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodosForStats() {
      setIsLoadingStats(true);
      setStatsError('');

      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Could not fetch todo stats');
        }

        const data = await response.json();
        const tasks = Array.isArray(data) ? data : data.tasks || [];

        setTodoList(tasks);
      } catch (error) {
        setStatsError(`Error loading profile stats: ${error.message}`);
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchTodosForStats();
  }, [token]);

  const totalTodos = todoList.length;
  const completedTodos = todoList.filter((todo) => todo.isCompleted).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : null;

  return (
    <section className="page profile-page">
      <div className="page-card">
        <div className="page-heading">
          <p className="page-heading__eyebrow">Your progress</p>
          <h2>Profile</h2>
          <p>View your account details and todo completion progress.</p>
        </div>

        <p className="profile-email">
          <strong>Email:</strong> {email}
        </p>

        <section className="content-section">
          <h3>Todo Statistics</h3>

          {statsError && (
            <p className="alert alert--error" role="alert">
              {statsError}
            </p>
          )}

          {isLoadingStats ? (
            <p className="loading-state">Loading todo stats...</p>
          ) : (
            <ul className="stats-list">
              <li>
                <span>Total todos</span>
                <strong>{totalTodos}</strong>
              </li>
              <li>
                <span>Active todos</span>
                <strong>{activeTodos}</strong>
              </li>
              <li>
                <span>Completed todos</span>
                <strong>{completedTodos}</strong>
              </li>
              <li>
                <span>Completion</span>
                <strong>
                  {completionPercentage !== null
                    ? `${completionPercentage}%`
                    : 'N/A'}
                </strong>
              </li>
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default ProfilePage;