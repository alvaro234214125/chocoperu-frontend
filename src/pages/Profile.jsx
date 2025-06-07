import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Eye, EyeOff, Pencil } from 'lucide-react';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (location.state && location.state.user) {
      setUserData(location.state.user);
      setEditName(location.state.user.username);
      setEditEmail(location.state.user.email);
    } else {
      axios
        .get('http://localhost:8080/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUserData(res.data);
          setEditName(res.data.username);
          setEditEmail(res.data.email);
        })
        .catch((err) => {
          console.error('Error al cargar perfil:', err);
          setUserData(null);
        });
    }
  }, [location.state, token]);

  const handleUpdate = (field) => {
    const updateData = {
      ...(field === 'name' && { username: editName }),
      ...(field === 'email' && { email: editEmail }),
      ...(field === 'password' && { password: editPassword }),
    };

    axios
      .put('http://localhost:8080/api/auth/update', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert('Actualización exitosa');
        setUserData(res.data);
      })
      .catch((err) => {
        console.error('Error actualizando:', err);
        alert('Error al actualizar');
      });
  };

  if (!userData) {
    return <div className="text-center mt-10 text-gray-600">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mi Cuenta</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleUpdate('name')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleUpdate('email')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
