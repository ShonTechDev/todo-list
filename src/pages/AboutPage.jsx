function AboutPage() {
  return (
    <section className="page about-page">
      <div className="page-card">
        <div className="page-heading">
          <p className="page-heading__eyebrow">About the project</p>
          <h2>About This Todo App</h2>

          <p>
            This app helps users manage todos with authentication, sorting,
            filtering, routing, input validation, and responsive styling.
          </p>
        </div>

        <section className="content-section">
          <h3>Features</h3>

          <ul className="content-list">
            <li>Create new todos</li>
            <li>Mark todos as complete</li>
            <li>Edit todo titles</li>
            <li>Sort and filter todos</li>
            <li>Navigate between pages using React Router</li>
            <li>Validate and sanitize todo input before saving</li>
          </ul>
        </section>

        <section className="content-section">
          <h3>Technologies Used</h3>

          <ul className="content-list">
            <li>React</li>
            <li>React Router</li>
            <li>Vite</li>
            <li>useReducer</li>
            <li>useContext</li>
            <li>DOMPurify</li>
            <li>CSS</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default AboutPage;