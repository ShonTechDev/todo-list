import './App.css'

function App() {

const todoList = [
  {id: 1, title: "populate flashcards"},
  {id: 2, title: "study vocabulary"},
  {id: 3, title: "actively code to solidify material"},
]

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}

export default App