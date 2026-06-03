import { useEffect, useReducer } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from '../../reducers/todoReducer.js';

function TodosPage() {
  const { token } = useAuth();

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const params = new URLSearchParams({
          sortBy,
          sortDirection,
        });

        if (debouncedFilterTerm) {
          params.append('find', debouncedFilterTerm);
        }

        const response = await fetch(`/api/tasks?${params}`, {
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

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks },
        });
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'creationDate' ||
          sortDirection !== 'desc'
        ) {
          dispatch({
            type: TODO_ACTIONS.SET_FILTER_ERROR,
            payload: {
              error: `Error filtering/sorting todos: ${error.message}`,
            },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              error: `Error fetching todos: ${error.message}`,
            },
          });
        }
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { todo: newTodo },
    });

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          originalId: newTodo.id,
          savedTodo,
        },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          originalId: newTodo.id,
          error: error.message,
        },
      });
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

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id,
        completedTodo,
      },
    });

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

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          error: error.message,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        id: editedTodo.id,
        editedTodo: { ...editedTodo },
      },
    });

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

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          originalTodo,
          error: error.message,
        },
      });
    }
  }

  function handleFilterChange(value) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER_TERM,
      payload: { filterTerm: value },
    });
  }

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button
            type="button"
            onClick={() =>
              dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
            }
          >
            Clear Filter Error
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        onSortByChange={(value) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT_BY,
            payload: { sortBy: value },
          })
        }
        sortDirection={sortDirection}
        onSortDirectionChange={(value) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT_DIRECTION,
            payload: { sortDirection: value },
          })
        }
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;