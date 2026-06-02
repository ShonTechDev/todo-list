import { useCallback, useEffect, useReducer } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TODO_LIST':
      return {
        ...state,
        todoList: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_FILTER_ERROR':
      return {
        ...state,
        filterError: action.payload,
      };

    case 'SET_IS_TODO_LIST_LOADING':
      return {
        ...state,
        isTodoListLoading: action.payload,
      };

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      };

    case 'SET_SORT_DIRECTION':
      return {
        ...state,
        sortDirection: action.payload,
      };

    case 'SET_FILTER_TERM':
      return {
        ...state,
        filterTerm: action.payload,
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: '',
      };

    case 'INVALIDATE_CACHE':
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case 'ADD_TODO_OPTIMISTIC':
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
      };

    case 'REPLACE_TODO':
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.originalId) {
            return action.payload.savedTodo;
          }

          return todo;
        }),
      };

    case 'REMOVE_TODO':
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload),
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload.updatedTodo;
          }

          return todo;
        }),
      };

    default:
      return state;
  }
}

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

  const invalidateCache = useCallback(() => {
    dispatch({ type: 'INVALIDATE_CACHE' });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodos() {
      dispatch({ type: 'SET_IS_TODO_LIST_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: '' });

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
        dispatch({ type: 'SET_TODO_LIST', payload: data.tasks });
        dispatch({ type: 'SET_FILTER_ERROR', payload: '' });
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'creationDate' ||
          sortDirection !== 'desc'
        ) {
          dispatch({
            type: 'SET_FILTER_ERROR',
            payload: `Error filtering/sorting todos: ${error.message}`,
          });
        } else {
          dispatch({
            type: 'SET_ERROR',
            payload: `Error fetching todos: ${error.message}`,
          });
        }
      } finally {
        dispatch({ type: 'SET_IS_TODO_LIST_LOADING', payload: false });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({ type: 'ADD_TODO_OPTIMISTIC', payload: newTodo });
    dispatch({ type: 'SET_ERROR', payload: '' });

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
        type: 'REPLACE_TODO',
        payload: {
          originalId: newTodo.id,
          savedTodo,
        },
      });

      invalidateCache();
    } catch (error) {
      dispatch({ type: 'REMOVE_TODO', payload: newTodo.id });
      dispatch({ type: 'SET_ERROR', payload: error.message });
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
      type: 'UPDATE_TODO',
      payload: {
        id,
        updatedTodo: completedTodo,
      },
    });
    dispatch({ type: 'SET_ERROR', payload: '' });

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

      invalidateCache();
    } catch (error) {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          updatedTodo: originalTodo,
        },
      });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: 'UPDATE_TODO',
      payload: {
        id: editedTodo.id,
        updatedTodo: { ...editedTodo },
      },
    });
    dispatch({ type: 'SET_ERROR', payload: '' });

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

      invalidateCache();
    } catch (error) {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id: editedTodo.id,
          updatedTodo: originalTodo,
        },
      });
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }

  function handleFilterChange(value) {
    dispatch({ type: 'SET_FILTER_TERM', payload: value });
  }

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ERROR', payload: '' })}
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
              dispatch({ type: 'SET_FILTER_ERROR', payload: '' })
            }
          >
            Clear Filter Error
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        onSortByChange={(value) =>
          dispatch({ type: 'SET_SORT_BY', payload: value })
        }
        sortDirection={sortDirection}
        onSortDirectionChange={(value) =>
          dispatch({ type: 'SET_SORT_DIRECTION', payload: value })
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