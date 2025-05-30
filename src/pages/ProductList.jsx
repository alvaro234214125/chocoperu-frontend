import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(res => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await axios.delete(`http://localhost:8080/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch {
      alert('No se pudo eliminar el producto');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      {user?.role === 'PROVIDER' || user?.role === 'ADMIN' ? (
        <Link className="btn btn-success mb-3" to="/products/create">Crear Producto</Link>
      ) : null}
      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
            {user?.role === 'ADMIN' || user?.id === product.provider?.id ? (
              <div>
                <Link className="btn btn-sm btn-primary me-2" to={`/products/edit/${product.id}`}>Editar</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>Eliminar</button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
