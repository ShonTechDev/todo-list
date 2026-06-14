import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  normalizeTodoTitle,
  TODO_TITLE_MAX_LENGTH,
} from '../../utils/todoValidation.js';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const isTodoTitleValid = isValidTodoTitle(workingTodoTitle);
  const isOverCharacterLimit =
    workingTodoTitle.trim().length > TODO_TITLE_MAX_LENGTH;

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (!isTodoTitleValid) {
      return;
    }

    onAddTodo(normalizeTodoTitle(workingTodoTitle));

    setWorkingTodoTitle('');
  };

  return (
    <form className="todo-form" onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />

      <div className="todo-form__helper">
        <span>
          {workingTodoTitle.trim().length}/{TODO_TITLE_MAX_LENGTH} characters
        </span>

        {isOverCharacterLimit && (
          <span className="todo-form__error">
            Todo must be {TODO_TITLE_MAX_LENGTH} characters or fewer.
          </span>
        )}
      </div>

      <button type="submit" disabled={!isTodoTitleValid}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;