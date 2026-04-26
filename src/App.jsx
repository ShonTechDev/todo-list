import { useState } from 'react';
import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
  const [todoList, setTodoList] = useState([]);

function addTodo(todoTitle) { //receives new todo text and adds it into todoList state
    const newTodo = {
      id: Date.now(), //generates a unique ID for each todo
      title: todoTitle,
    };
    setTodoList((previous) => [newTodo, ...previous]) //puts the new to do first, maintains the old ones
}
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> {/*passes the handler to TodoForm */}
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App