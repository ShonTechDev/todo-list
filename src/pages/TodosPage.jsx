import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';
import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from '../reducers/todoReducer.js';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

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

  const statusFilter = searchParams.get('status') || 'all';
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
          sortBy !== 'createdDate' ||
          sortDirection !== 'asc'
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
    <section className="page todos-page">
      <div className="page-card todos-page__card">
        <div className="page-heading">
          <p className="page-heading__eyebrow">Plan your day</p>
          <h2>My Todos</h2>
          <p>
            Add, update, complete, filter, and sort tasks from one organized
            workspace.
          </p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
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
          <div className="alert alert--warning" role="alert">
            <p>{filterError}</p>

            <div className="button-row">
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
          </div>
        )}

        {isTodoListLoading && <p className="loading-state">Loading todos...</p>}

        <section className="todos-page__controls" aria-label="Todo controls">
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

          <StatusFilter />

          <FilterInput
            filterTerm={filterTerm}
            onFilterChange={handleFilterChange}
          />
        </section>

        <TodoForm onAddTodo={addTodo} />

        <TodoList
          todoList={todoList}
          dataVersion={dataVersion}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          statusFilter={statusFilter}
        />
      </div>
    </section>
  );
}

export default TodosPage;