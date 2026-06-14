import Navigation from './Navigation.jsx';

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__content">
        <div>
          <p className="site-header__eyebrow">Final Project</p>
          <h1>Todo List</h1>
        </div>

        <Navigation />
      </div>
    </header>
  );
}

export default Header;