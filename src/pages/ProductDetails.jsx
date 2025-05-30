import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem('token');
  const { loadCartCount } = useCart()

  useEffect(() => {
    axios.get(`http://localhost:8080/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setQuantity(1);
      })
      .catch(() => setProduct(null));
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

  function handleAddToCart() {
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      alert('Cantidad inválida');
      return;
    }

    setAdding(true);
    axios.post('http://localhost:8080/cart', {
      productId: Number(id),
      quantity: quantity
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Producto agregado al carrito');
      loadCartCount(); 
    })
    .catch(() => alert('Error al agregar al carrito'))
    .finally(() => setAdding(false));
  }

  if (!product) return <p className="container mt-4">Producto no encontrado</p>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <p><strong>Descripción:</strong> {product.description}</p>
      <p><strong>Precio:</strong> S/ {product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Categoría:</strong> {product.categoryName || 'N/A'}</p>
      <p><strong>Proveedor:</strong> {product.providerName || 'N/A'}</p>

      {}
      {product.stock > 0 && (
        <div className="mt-3 d-flex align-items-center gap-2">
          <label htmlFor="quantity" className="form-label m-0">Cantidad:</label>
          <input
            id="quantity"
            type="number"
            className="form-control"
            style={{ width: '100px' }}
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="btn btn-primary mt-3"
        disabled={adding || product.stock <= 0}
      >
        {adding ? 'Agregando...' : product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </button>

      <hr className="my-5" />

      <h4>Otros productos que podrían interesarte</h4>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 pb-4">
        {relatedProducts.length === 0 && <p>No hay más productos disponibles.</p>}
        {relatedProducts.map(p => (
          <div key={p.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted">{p.description?.substring(0, 60)}...</p>
                <p className="fw-bold">S/ {p.price}</p>
                <Link to={`/products/${p.id}`} className="btn btn-outline-primary mt-auto">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
