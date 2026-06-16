import styles from '../App.module.css';
import Navigation from './Navigation.jsx';

function Header() {
  return (
    <header className={styles['site-header']}>
      <div className={styles['site-header__content']}>
        <div>
          <p className={styles['site-header__eyebrow']}>Final Project</p>
          <h1>Todo List</h1>
        </div>

        <Navigation />
      </div>
    </header>
  );
}

export default Header;