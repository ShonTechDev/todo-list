export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  SET_FILTER_ERROR: 'SET_FILTER_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',

  SET_SORT_BY: 'SET_SORT_BY',
  SET_SORT_DIRECTION: 'SET_SORT_DIRECTION',
  SET_FILTER_TERM: 'SET_FILTER_TERM',
  RESET_FILTERS: 'RESET_FILTERS',

  INVALIDATE_CACHE: 'INVALIDATE_CACHE',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload.todos,
        filterError: '',
        isTodoListLoading: false,
      };

    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isTodoListLoading: false,
      };

    case TODO_ACTIONS.SET_FILTER_ERROR:
      return {
        ...state,
        filterError: action.payload.error,
        isTodoListLoading: false,
      };

    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload.todo, ...state.todoList],
        error: '',
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.originalId) {
            return action.payload.savedTodo;
          }

          return todo;
        }),
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.filter(
          (todo) => todo.id !== action.payload.originalId
        ),
        error: action.payload.error,
      };

    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload.completedTodo;
          }

          return todo;
        }),
        error: '',
      };

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
        error: '',
      };

    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload.originalTodo;
          }

          return todo;
        }),
        error: action.payload.error,
      };

    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload.editedTodo;
          }

          return todo;
        }),
        error: '',
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
        error: '',
      };

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload.originalTodo;
          }

          return todo;
        }),
        error: action.payload.error,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };

    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: '',
      };

    case TODO_ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload.sortBy,
      };

    case TODO_ACTIONS.SET_SORT_DIRECTION:
      return {
        ...state,
        sortDirection: action.payload.sortDirection,
      };

    case TODO_ACTIONS.SET_FILTER_TERM:
      return {
        ...state,
        filterTerm: action.payload.filterTerm,
      };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: '',
      };

    case TODO_ACTIONS.INVALIDATE_CACHE:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    default:
      return state;
  }
}