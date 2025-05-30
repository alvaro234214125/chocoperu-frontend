import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:8080/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
