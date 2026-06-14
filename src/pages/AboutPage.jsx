import styles from '../App.module.css';

function AboutPage() {
  return (
    <section className={`${styles.page} ${styles['about-page']}`}>
      <div className={styles['page-card']}>
        <div className={styles['page-heading']}>
          <p className={styles['page-heading__eyebrow']}>About the project</p>
          <h2>About This Todo App</h2>

          <p>
            This app helps users manage todos with authentication, sorting,
            filtering, routing, input validation, and responsive styling.
          </p>
        </div>

        <section className={styles['content-section']}>
          <h3>Features</h3>

          <ul className={styles['content-list']}>
            <li>Create new todos</li>
            <li>Mark todos as complete</li>
            <li>Edit todo titles</li>
            <li>Sort and filter todos</li>
            <li>Navigate between pages using React Router</li>
            <li>Validate and sanitize todo input before saving</li>
          </ul>
        </section>

        <section className={styles['content-section']}>
          <h3>Technologies Used</h3>

          <ul className={styles['content-list']}>
            <li>React</li>
            <li>React Router</li>
            <li>Vite</li>
            <li>useReducer</li>
            <li>useContext</li>
            <li>DOMPurify</li>
            <li>CSS Modules</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default AboutPage;