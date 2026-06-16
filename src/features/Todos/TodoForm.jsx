import { useState } from 'react';
import styles from '../../App.module.css';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  normalizeTodoTitle,
  TODO_TITLE_MAX_LENGTH,
} from '../../utils/todoValidation.js';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const isTodoTitleValid = isValidTodoTitle(workingTodoTitle);
  const isOverCharacterLimit =
    workingTodoTitle.trim().length > TODO_TITLE_MAX_LENGTH;

  const handleAddTodo = async (event) => {
    event.preventDefault();

    if (!isTodoTitleValid || isAddingTodo) {
      return;
    }

    setIsAddingTodo(true);

    try {
      await onAddTodo(normalizeTodoTitle(workingTodoTitle));
      setWorkingTodoTitle('');
    } finally {
      setIsAddingTodo(false);
    }
  };

  return (
    <form className={styles['todo-form']} onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />

      <div className={styles['todo-form__helper']}>
        <span>
          {workingTodoTitle.trim().length}/{TODO_TITLE_MAX_LENGTH} characters
        </span>

        {isAddingTodo && (
          <span className={styles['action-status']}>Adding todo...</span>
        )}

        {isOverCharacterLimit && (
          <span className={styles['todo-form__error']}>
            Todo must be {TODO_TITLE_MAX_LENGTH} characters or fewer.
          </span>
        )}
      </div>

      <button type="submit" disabled={!isTodoTitleValid || isAddingTodo}>
        {isAddingTodo ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;