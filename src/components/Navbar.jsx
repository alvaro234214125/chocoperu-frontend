import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = async () => {
    setShowDropdown(false)
    try {
      const response = await axios.get('http://localhost:8080/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Usuario actual:', response.data);
      navigate('/profile', { state: { user: response.data } });
    } catch (error) {
      console.error('Error al obtener datos del usuario', error);
    }
  };

  const goToOrders = () => {
    setShowDropdown(false);
    navigate('/orders');
  };

  useEffect(() => {
    if (!user || !token) {
      setCartCount(0);
      return;
    }

    axios.get('http://localhost:8080/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setCartCount(res.data.length);
    })
    .catch(() => setCartCount(0));
  }, [user, token]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ChocoPerú
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>

            {user && (
              <li className="nav-item position-relative mx-3">
                <Link className="nav-link" to="/cart" title="Ver carrito">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-1px',
                        right: '-6px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {user ? (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Hola, <strong>{user.username}</strong>
                </span>
                <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`}>
                  <li>
                    <button className="dropdown-item" onClick={goToProfile}>
                      Mi cuenta
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={goToOrders}>
                      Mis pedidos
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
