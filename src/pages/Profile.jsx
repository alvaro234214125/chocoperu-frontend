import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (location.state?.user) {
      const user = location.state.user;
      setUserData(user);
      setEditName(user.username);
      setEditEmail(user.email);
      setLoading(false);
    } else {
      axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setUserData(res.data);
          setEditName(res.data.username);
          setEditEmail(res.data.email);
        })
        .catch(() => {
          setError('No se pudo cargar el perfil.');
        })
        .finally(() => setLoading(false));
    }
  }, [location.state, token]);

  const handleUpdate = async (field) => {
    const value = {
      name: editName,
      email: editEmail,
      password: editPassword,
    }[field];

    if (!value || value.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, completa el campo antes de actualizar.',
      });
      return;
    }

    const updateData = {
      ...(field === 'name' && { username: value }),
      ...(field === 'email' && { email: value }),
      ...(field === 'password' && { password: value }),
    };

    try {
      const res = await axios.put('http://localhost:8080/api/auth/update', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
      if (field === 'password') setEditPassword('');

      toast.success('Información actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la información. Intenta nuevamente.',
      });
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleUpdate('name')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
              title="Actualizar nombre"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleUpdate('email')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
              title="Actualizar correo"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={() => handleUpdate('password')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
              title="Actualizar contraseña"
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
