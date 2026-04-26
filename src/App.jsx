import { useState } from 'react';
import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

const todos = [
  {id: 1, title: "populate flashcards"},
  {id: 2, title: "study vocabulary"},
  {id: 3, title: "actively code to solidify material"},
];

function App() {
  const [todoList, setTodoList] = useState(todos);

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App