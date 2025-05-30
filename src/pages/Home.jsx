import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
    }).catch(() => {
      localStorage.removeItem('token');
    });
  }, []);

  if (!user) return <p>Cargando... o aun no se ha iniciado sesión</p>;

  return (
    <div>
      <h2>Hola!, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Home;
