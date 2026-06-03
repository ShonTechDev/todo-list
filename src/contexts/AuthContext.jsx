import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

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

        return {
          success: true,
          message: '',
        };
      }

      return {
        success: false,
        message: `Authentication failed: ${data?.message}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.name} | ${error.message}`,
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

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      setEmail('');
      setToken('');

      return {
        success: false,
        message: `Error: ${error.name} | ${error.message}`,
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