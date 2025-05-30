import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = () => {
    if (!token) return;

    setLoading(true);
    axios.get('http://localhost:8080/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCartItems(res.data);
      setLoading(false);
    })
    .catch(err => {
      setError('No se pudo cargar el carrito');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleRemove = (id) => {
    axios.delete(`http://localhost:8080/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setCartItems(items => items.filter(item => item.id !== id));
    })
    .catch(() => {
      alert('Error eliminando el item del carrito');
    });
  };

  const handleCreateOrder = () => {
    axios.post('http://localhost:8080/cart/checkout', null, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        alert('¡Pedido realizado con éxito!');
        setCartItems([]);
    })
    .catch(() => {
        alert('Error al crear la orden');
    });
    };


  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>S/ {item.unitPrice.toFixed(2)}</td>
                <td>S/ {item.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      )}
      {cartItems.length > 0 && (
  <div className="mt-4 text-end">
    <button className="btn btn-success" onClick={handleCreateOrder}>
      Finalizar Pedido
    </button>
  </div>
)}

    </div>
  );
}

export default Cart;
