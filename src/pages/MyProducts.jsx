import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: 'Acceso restringido',
        text: 'Inicia sesión para ver tus productos.',
        icon: 'warning',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchMyProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/products/my-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Error al cargar productos del proveedor:', err);
      }
    };

    fetchMyProducts();
  }, [token, navigate]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Mis Productos</h2>
        <Link
          to="/create-product"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm shadow transition"
        >
          + Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-6 rounded-md shadow">
          <p className="text-lg font-medium">Aún no has agregado productos.</p>
          <p className="text-sm">Haz clic en “+ Nuevo Producto” para comenzar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-500 mt-1 text-sm">{product.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <span className="text-blue-600 font-bold text-lg">S/ {product.price}</span>
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
