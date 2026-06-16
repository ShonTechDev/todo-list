import DOMPurify from 'dompurify';

export const TODO_TITLE_MAX_LENGTH = 100;

export function normalizeTodoTitle(title) {
  return DOMPurify.sanitize(title, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

export function isValidTodoTitle(title) {
  const normalizedTitle = normalizeTodoTitle(title);

  return (
    normalizedTitle.length > 0 &&
    normalizedTitle.length <= TODO_TITLE_MAX_LENGTH
  );
}