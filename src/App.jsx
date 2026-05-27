import { useState } from 'react';
import './App.css';
import TodosPage from './features/Todos/TodosPage.jsx';
import Logon from './features/Logon.jsx';
import Header from './shared/Header.jsx';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <div>
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />

      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );
}

export default App;