import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const token = localStorage.getItem('token');
const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
      return;
    }

    axios.get('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => localStorage.removeItem('token'))
    .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  axios.get('http://localhost:8080/products', { headers })
    .then(res => setProducts(res.data))
    .finally(() => setLoadingProducts(false));
}, []);

  if (loadingUser || loadingProducts)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-5">
      {user && (
        <div className="mb-4 text-center">
          <h4>Bienvenido <strong>{user.username}</strong>!</h4>
          <p className="text-muted">¡Explora el catálogo de productos!</p>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {products.map(product => (
          <div className="col" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description?.substring(0, 60)}...</p>
                <p className="fw-bold">S/ {product.price}</p>
                <Link to={`/products/${product.id}`} className="btn btn-outline-primary mt-auto">Ver más</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center mt-5">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
