import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (location.state && location.state.user) {
      setUserData(location.state.user);
    } else {
      axios
        .get('http://localhost:8080/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUserData(res.data))
        .catch((err) => {
          console.error('Error al cargar perfil:', err);
          setUserData(null);
        });
    }
  }, [location.state, token]);

  if (!userData) {
    return <div className="container mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Mi cuenta</h2>
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{userData.username}</h5>
          <p className="card-text">
            <strong>Email:</strong> {userData.email}
          </p>
          <p className="card-text">
            <strong>Rol:</strong> {userData.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
