import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = async () => {
    setShowDropdown(false);
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      navigate('/profile', { state: { user: data } });
    } catch (error) {
      console.error('Error al obtener datos del usuario', error);
    }
  };

  const goToOrders = () => {
    setShowDropdown(false);
    navigate('/orders');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-3 pr-10">
          <img
            src="/projects/chocoperu.webp"
            alt="ChocoPerú Logo"
            className="w-10 h-10 object-contain rounded-full"
          />
          <span className="text-2xl font-extrabold tracking-wide select-none">ChocoPerú</span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">

          <Link
            to="/"
            className="hover:text-blue-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2"
          >
            Inicio
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                className="relative hover:text-blue-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2 flex items-center"
                aria-label="Carrito"
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 hover:text-blue-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2"
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  Hola, <strong>{user.username}</strong>
                  {showDropdown ? (
                    <HiChevronUp className="w-5 h-5" />
                  ) : (
                    <HiChevronDown className="w-5 h-5" />
                  )}
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-40 overflow-hidden
                    before:absolute before:-top-2 before:right-5 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-200 before:border-t-gray-200 before:border-l-gray-200"
                    style={{ position: 'absolute' }}
                  >
                    <button
                      onClick={goToProfile}
                      className="w-full text-left px-5 py-3 hover:bg-gray-100 transition font-medium"
                    >
                      Mi cuenta
                    </button>

                    <button
                      onClick={goToOrders}
                      className="w-full text-left px-5 py-3 hover:bg-gray-100 transition font-medium"
                    >
                      Mis pedidos
                    </button>

                    {user.role === 'PROVIDER' && (
                      <>
                        <Link
                          to="/my-products"
                          onClick={() => setShowDropdown(false)}
                          className="block text-left px-5 py-3 hover:bg-gray-100 transition font-medium"
                        >
                          Mis productos
                        </Link>
                        
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-3 py-2"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
