function AboutPage() {
  return (
    <div>
      <h2>About This Todo App</h2>

      <p>
        This app helps users manage todos with authentication, sorting,
        filtering, and routing.
      </p>

      <h3>Features</h3>
      <ul>
        <li>Create new todos</li>
        <li>Mark todos as complete</li>
        <li>Edit todo titles</li>
        <li>Sort and filter todos</li>
        <li>Navigate between pages using React Router</li>
      </ul>
      
      <h3>Technologies Used</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
        <li>useReducer</li>
        <li>useContext</li>
      </ul>
    </div>
  );
}

export default AboutPage;