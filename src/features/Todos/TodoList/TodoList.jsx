import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList, dataVersion, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = useMemo(() => {
    console.log('Filtering incomplete todos');

    return todoList.filter((todo) => todo.isCompleted === false);
  }, [todoList, dataVersion]);

  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;