import { useEffect, useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
  if (!token) {
    return;
  }

  async function fetchTodos() {
    setIsTodoListLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Could not fetch todos');
      }

      const data = await response.json();
      setTodoList(data.tasks);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsTodoListLoading(false);
    }
  }

  fetchTodos();
}, [token]);

 async function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
  };

  setTodoList((previous) => [newTodo, ...previous]);
  setError('');

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({
        title: newTodo.title,
        isCompleted: newTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error('Could not add todo');
    }

    const savedTodo = await response.json();

    setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === newTodo.id) {
          return savedTodo;
        }

        return todo;
      })
    );
  } catch (error) {
    setTodoList((previous) =>
      previous.filter((todo) => todo.id !== newTodo.id)
    );
    setError(error.message);
  }
}

 async function completeTodo(id) {
  const originalTodo = todoList.find((todo) => todo.id === id);

  if (!originalTodo) {
    return;
  }

  const completedTodo = {
    ...originalTodo,
    isCompleted: true,
  };

  setTodoList((previous) =>
    previous.map((todo) => {
      if (todo.id === id) {
        return completedTodo;
      }

      return todo;
    })
  );
  setError('');

  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
     body: JSON.stringify({
     isCompleted: true,
     }),
    });

    if (!response.ok) {
      throw new Error('Could not complete todo');
    }
  } catch (error) {
    setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === id) {
          return originalTodo;
        }

        return todo;
      })
    );
    setError(error.message);
  }
}

 async function updateTodo(editedTodo) {
  const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

  if (!originalTodo) {
    return;
  }

  setTodoList((previous) =>
    previous.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      }

      return todo;
    })
  );
  setError('');

  try {
    const response = await fetch(`/api/tasks/${editedTodo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({
      title: editedTodo.title,
      isCompleted: editedTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error('Could not update todo');
    }
  } catch (error) {
    setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === editedTodo.id) {
          return originalTodo;
        }

        return todo;
      })
    );
    setError(error.message);
  }
}
  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
         </div>
      )}

    {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;