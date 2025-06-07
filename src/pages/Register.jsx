import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
        role,
      });

      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert('Registro fallido. Por favor, verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8"
      >
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Crear Cuenta</h2>

        <div className="mb-5">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
          />
        </div>

        <div className="mb-8 flex justify-center gap-6">
          <label
            className={`cursor-pointer flex-1 max-w-[140px] rounded-xl border-2 p-4 text-center font-semibold text-gray-700
              ${role === 'USER' ? 'border-blue-600 bg-blue-100 text-blue-700 shadow-md' : 'border-gray-300 bg-gray-100 hover:border-blue-500 hover:bg-blue-50'}
            `}
            onClick={() => setRole('USER')}
          >
            Usuario
            <input
              type="radio"
              name="role"
              value="USER"
              checked={role === 'USER'}
              onChange={() => setRole('USER')}
              className="hidden"
            />
          </label>

          <label
            className={`cursor-pointer flex-1 max-w-[140px] rounded-xl border-2 p-4 text-center font-semibold text-gray-700
              ${role === 'PROVIDER' ? 'border-blue-600 bg-blue-100 text-blue-700 shadow-md' : 'border-gray-300 bg-gray-100 hover:border-blue-500 hover:bg-blue-50'}
            `}
            onClick={() => setRole('PROVIDER')}
          >
            Proveedor
            <input
              type="radio"
              name="role"
              value="PROVIDER"
              checked={role === 'PROVIDER'}
              onChange={() => setRole('PROVIDER')}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}

export default Register;
