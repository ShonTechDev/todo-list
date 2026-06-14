import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  normalizeTodoTitle,
} from '../../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const isWorkingTitleValid = isValidTodoTitle(workingTitle);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (!isEditing || !isWorkingTitleValid) {
      return;
    }

    onUpdateTodo({
      ...todo,
      title: normalizeTodoTitle(workingTitle),
    });

    setIsEditing(false);
  }

  return (
    <li className={`todo-item ${todo.isCompleted ? 'todo-item--completed' : ''}`}>
      <form className="todo-item__form" onSubmit={handleUpdate}>
        {isEditing ? (
          <div className="todo-item__edit">
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
            />

            <div className="todo-item__actions">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>

              <button type="submit" disabled={!isWorkingTitleValid}>
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-item__view">
            <label className="todo-item__checkbox-label">
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                disabled={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span className="sr-only">Complete {todo.title}</span>
            </label>

            <span className="todo-item__title">{todo.title}</span>

            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;