import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:8080/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setQuantity(1);
      })
      .catch(() => {
        setError('Producto no encontrado');
        setProduct(null);
      });
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:8080/products', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then(res => {
      const filtered = res.data.filter(p => p.id !== Number(id));
      setRelatedProducts(filtered);
    })
    .catch(() => setRelatedProducts([]));
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        confirmButtonText: 'Ir a iniciar sesión',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Cantidad inválida',
        text: `Ingresa una cantidad válida (1 - ${product.stock})`,
      });
      return;
    }

    try {
      setAdding(true);
      await axios.post('http://localhost:8080/cart', {
        productId: Number(id),
        quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Producto agregado al carrito 🛒');
      fetchCart();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el producto al carrito.',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (value) => {
    const parsed = Number(value);
    if (!isNaN(parsed) && parsed > 0 && parsed <= product?.stock) {
      setQuantity(parsed);
    }
  };

  if (error) {
    return <p className="container mx-auto mt-8 text-center text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="container mx-auto mt-8 text-center text-gray-700">Cargando producto...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-5/12 flex justify-center items-center bg-white rounded-2xl shadow p-6" style={{ height: 350 }}>
          <img
            src={product.imageUrl || '/default.png'}
            alt={product.name}
            onError={(e) => (e.target.src = '/default.png')}
            className="max-h-full object-contain"
          />
        </div>

        <div className="md:w-7/12 space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
          <div className="text-gray-700">
  <p className="font-medium">Descripción:</p>
  <p className="whitespace-pre-line break-words max-w-full">{product.description}</p>
</div>

          <p><strong>Precio:</strong> S/ {product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Categoría:</strong> {product.categoryName || 'N/A'}</p>
          <p><strong>Proveedor:</strong> {product.providerName || 'N/A'}</p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <label htmlFor="quantity" className="font-medium text-gray-700">Cantidad:</label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition
              ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              ${adding ? 'opacity-70 cursor-wait' : ''}`}
          >
            {adding ? 'Agregando...' : product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
          </button>
        </div>
      </div>

      <hr className="my-12 border-gray-300" />

      <h4 className="text-2xl font-semibold mb-6 text-gray-800">Otros productos que podrían interesarte</h4>

      {relatedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No hay más productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <img
                src={p.imageUrl || '/default.png'}
                alt={p.name}
                onError={(e) => (e.target.src = '/default.png')}
                className="h-44 object-contain p-4 bg-white"
              />
              <div className="flex flex-col flex-grow p-4">
                <h5 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h5>
                <p className="text-sm text-gray-500 flex-grow">{p.description?.slice(0, 60)}...</p>
                <p className="mt-3 font-bold text-gray-900">S/ {p.price.toFixed(2)}</p>
                <Link
                  to={`/products/${p.id}`}
                  className="mt-4 inline-block text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
