import { useState } from 'react';
import styles from '../../../App.module.css';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  normalizeTodoTitle,
} from '../../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
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

  function handleDelete() {
    const shouldDelete = window.confirm(`Delete "${todo.title}"?`);

    if (shouldDelete) {
      onDeleteTodo(todo.id);
    }
  }

  return (
    <li
      className={
        todo.isCompleted
          ? `${styles['todo-item']} ${styles['todo-item--completed']}`
          : styles['todo-item']
      }
    >
      <form className={styles['todo-item__form']} onSubmit={handleUpdate}>
        {isEditing ? (
          <div className={styles['todo-item__edit']}>
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
            />

            <div className={styles['todo-item__actions']}>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>

              <button type="submit" disabled={!isWorkingTitleValid}>
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className={styles['todo-item__view']}>
            <label className={styles['todo-item__checkbox-label']}>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                disabled={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span className={styles['sr-only']}>Complete {todo.title}</span>
            </label>

            <span className={styles['todo-item__title']}>{todo.title}</span>

            <div className={styles['todo-item__actions']}>
              <button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </button>

              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;