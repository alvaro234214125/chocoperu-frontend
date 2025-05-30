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
    <>
      <style>{`
        .role-selector {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }
        .role-card {
          flex: 1;
          max-width: 140px; /* reducido */
          padding: 0.75rem 1rem; /* menos padding */
          border: 2px solid #ccc;
          border-radius: 10px;
          text-align: center;
          font-weight: 600;
          font-size: 1rem; /* fuente más pequeña */
          cursor: pointer;
          user-select: none;
          transition: all 0.3s ease;
          background: #f9f9f9;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
        }
        .role-card:hover {
          border-color: #007bff;
          box-shadow: 0 4px 10px rgb(0 123 255 / 0.3);
          background: #e9f0ff;
        }
        .role-card.selected {
          border-color: #007bff;
          background: #cce5ff;
          box-shadow: 0 4px 10px rgb(0 123 255 / 0.6);
          color: #004085;
        }
        .role-input {
          display: none;
        }
      `}</style>

      <div className="container mt-5 d-flex justify-content-center">
        <form
          onSubmit={handleRegister}
          className="card p-4 shadow"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <h2 className="mb-4 text-center">Crear Cuenta</h2>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              required
            />
          </div>

          <div className="role-selector">
            <label
              className={`role-card ${role === 'USER' ? 'selected' : ''}`}
              htmlFor="roleUser"
              onClick={() => setRole('USER')}
            >
              Usuario
              <input
                type="radio"
                id="roleUser"
                name="role"
                value="USER"
                checked={role === 'USER'}
                onChange={() => setRole('USER')}
                className="role-input"
              />
            </label>

            <label
              className={`role-card ${role === 'PROVIDER' ? 'selected' : ''}`}
              htmlFor="roleProvider"
              onClick={() => setRole('PROVIDER')}
            >
              Proveedor
              <input
                type="radio"
                id="roleProvider"
                name="role"
                value="PROVIDER"
                checked={role === 'PROVIDER'}
                onChange={() => setRole('PROVIDER')}
                className="role-input"
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
