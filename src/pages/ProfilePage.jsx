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

  return (
    <div>
      <h2>Profile</h2>

      <p>
        <strong>Email:</strong> {email}
      </p>

      <h3>Todo Statistics</h3>

      {statsError && <p>{statsError}</p>}

      {isLoadingStats ? (
        <p>Loading todo stats...</p>
      ) : (
        <ul>
          <li>Total todos: {totalTodos}</li>
          <li>Active todos: {activeTodos}</li>
          <li>Completed todos: {completedTodos}</li>
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;