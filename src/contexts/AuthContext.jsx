import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('email') || '';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  async function login(email, password) {
    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);

        localStorage.setItem('email', data.name);
        localStorage.setItem('token', data.csrfToken);

        return {
          success: true,
          error: '',
        };
      }

      return {
        success: false,
        error: `Authentication failed: ${data?.message}`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error: ${error.name} | ${error.message}`,
      };
    }
  }

  async function logout() {
    try {
      await fetch('/api/users/logoff', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      setEmail('');
      setToken('');

      localStorage.removeItem('email');
      localStorage.removeItem('token');

      return {
        success: true,
        error: '',
      };
    } catch (error) {
      setEmail('');
      setToken('');

      localStorage.removeItem('email');
      localStorage.removeItem('token');

      return {
        success: false,
        error: `Error: ${error.name} | ${error.message}`,
      };
    }
  }

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };