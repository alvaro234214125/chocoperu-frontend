import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Cart() {
  const { token } = useAuth();
  const { cartItems, setCartItems, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchCart();
      setLoading(false);
    }
  }, [token]);

  const handleRemove = (id) => {
    axios.delete(`http://localhost:8080/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
    })
    .catch(() => alert('Error eliminando el item del carrito'));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    axios.put(`http://localhost:8080/cart/${itemId}?quantity=${newQuantity}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      const updatedItems = cartItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      );
      setCartItems(updatedItems);
    })
    .catch(() => alert('Error al actualizar la cantidad'));
  };

  const handleCreateOrder = () => {
    axios.post('http://localhost:8080/cart/checkout', null, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('¡Pedido realizado con éxito!');
      setCartItems([]);
    })
    .catch(() => alert('Error al crear la orden'));
  };

  const totalCarrito = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  if (loading) return <div className="container mx-auto mt-10 text-center text-gray-600">Cargando carrito...</div>;
  if (error) return <div className="container mx-auto mt-10 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Tu Carrito</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white shadow-md rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 flex-grow min-w-[250px]">
                  <img
                    src={item.productImage || '/default.png'}
                    alt={item.productName}
                    className="rounded-lg w-20 h-20 object-cover"
                    onError={(e) => (e.target.src = '/default.png')}
                  />
                  <div>
                    <h5 className="text-lg font-semibold mb-1">{item.productName}</h5>
                    <div className="flex items-center gap-2">
                      <button
                        className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >-</button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="w-14 text-center border border-gray-300 rounded py-1"
                        min={1}
                      />
                      <button
                        className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                </div>

                <div className="text-center min-w-[140px]">
                  <p className="text-gray-500 mb-1">Unitario: <strong>S/ {item.unitPrice.toFixed(2)}</strong></p>
                  <p className="text-gray-500">Subtotal: <strong>S/ {item.totalPrice.toFixed(2)}</strong></p>
                </div>

                <div>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={() => handleRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <h5 className="text-lg font-semibold">
              Total estimado: <strong>S/ {totalCarrito.toFixed(2)}</strong>
            </h5>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              onClick={handleCreateOrder}
            >
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
