function TodoList() {
    
const todoList = [
  {id: 1, title: "populate flashcards"},
  {id: 2, title: "study vocabulary"},
  {id: 3, title: "actively code to solidify material"},
];

return (
    <ul>
        {todoList.map(todo => (<li key={todo.id}>{todo.title}</li>))}
    </ul>
  );
}

export default TodoList;