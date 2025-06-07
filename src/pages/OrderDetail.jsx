import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:8080/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setOrder(res.data))
    .catch(err => {
      console.error('Error al obtener el pedido:', err);
      alert('No se pudo cargar el detalle del pedido.');
    })
    .finally(() => setLoading(false));
  }, [id, token]);

  const handlePayOrder = () => {
    if (!window.confirm('¿Confirmas el pago de esta orden?')) return;

    axios.post(`http://localhost:8080/orders/${id}/pay`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('Orden pagada con éxito');
      window.location.reload();
    })
    .catch((error) => {
      alert('Error al pagar la orden');
      console.error(error);
    });
  };

  const handleCancelOrder = () => {
    if (!window.confirm('¿Seguro que quieres cancelar este pedido?')) return;

    axios.post(`http://localhost:8080/orders/${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('Pedido cancelado correctamente');
      window.location.reload();
    })
    .catch((error) => {
      alert('Error al cancelar el pedido');
      console.error(error);
    });
  };

  if (loading) return <div className="container mx-auto mt-10 text-center text-gray-700">Cargando detalle del pedido...</div>;
  if (!order) return <div className="container mx-auto mt-10 text-center text-red-500">No se encontró el pedido.</div>;

  const statusStyles = {
    PENDING: 'bg-yellow-300 text-yellow-900',
    PAID: 'bg-green-500 text-white',
    CANCELED: 'bg-red-500 text-white',
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-6">Detalle del Pedido #{order.id}</h3>

        <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> S/ {order.totalPrice.toFixed(2)}</p>
        <p>
          <strong>Estado:</strong>{' '}
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[order.status] || 'bg-gray-300 text-gray-700'}`}>
            {order.status}
          </span>
        </p>

        <h5 className="mt-6 mb-3 text-lg font-semibold">Productos</h5>
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
          {order.items.map(item => (
            <li key={item.id} className="flex justify-between items-center p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.productImage || '/default.png'}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <span className="text-gray-800">{item.productName}</span>
              </div>
              <span className="text-gray-700">
                Cantidad: {item.quantity} &mdash; S/ {item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        {order.status === 'PENDING' && (
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handlePayOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold transition"
            >
              Pagar orden
            </button>
            <button
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition"
            >
              Cancelar pedido
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/orders')}
          className="mt-8 px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
        >
          Volver a Mis Pedidos
        </button>
      </div>
    </div>
  );
}

export default OrderDetail;
