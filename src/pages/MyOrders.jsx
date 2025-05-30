import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) return;

    axios
      .get('http://localhost:8080/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Error al obtener pedidos:', err);
      })
      .finally(() => setLoading(false));
  }, [user, token]);
const handlePayOrder = (orderId) => {
  navigate(`/payment/${orderId}`);
};

const handleCancelOrder = (orderId) => {
  if (!window.confirm('¿Seguro que quieres cancelar este pedido?')) return;

  axios
    .post(`http://localhost:8080/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('Pedido cancelado correctamente');
      setLoading(true);
      axios
        .get('http://localhost:8080/orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .finally(() => setLoading(false));
    })
    .catch((error) => {
      alert('Error al cancelar el pedido');
      console.error(error);
    });
};
  const toggleDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderDetails[orderId]) {
      axios
        .get(`http://localhost:8080/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrderDetails((prev) => ({
            ...prev,
            [orderId]: res.data,
          }));
        })
        .catch((err) => {
          console.error('Error al obtener detalles del pedido:', err);
        });
    }
  };

  if (loading) {
    return <div className="container mt-5">Cargando pedidos...</div>;
  }

  if (orders.length === 0) {
    return <div className="container mt-5">No tienes pedidos aún.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Mis Pedidos</h2>
      <div className="list-group mt-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="list-group-item list-group-item-action flex-column align-items-start shadow-sm mb-3"
          >
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Pedido #{order.id}</h5>
                <small>Fecha: {new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
              <button
                onClick={() => toggleDetails(order.id)}
                className="btn btn-link"
                style={{ fontSize: '1.5rem', lineHeight: 1 }}
                aria-label={expandedOrderId === order.id ? 'Cerrar detalles' : 'Abrir detalles'}
              >
                {expandedOrderId === order.id ? '▲' : '▼'}
              </button>
            </div>
            <p className="mb-1">
              Total: S/ {order.totalPrice.toFixed(2)} <br />
              Estado: {order.status}
            </p>

            {}
            {expandedOrderId === order.id && orderDetails[order.id] && (
  <div className="mt-3 border-top pt-3">
    <h6>Items del pedido:</h6>
    <ul className="list-unstyled">
      {orderDetails[order.id].items.map((item) => (
        <li key={item.id} className="mb-2">
          Producto: {item.productName} — Cantidad: {item.quantity} — Precio: S/ {item.price.toFixed(2)}
        </li>
      ))}
    </ul>

    {order.status === 'PENDING' && (
  <div className="mt-3">
    <button
      className="btn btn-success me-2"
      onClick={() => handlePayOrder(order.id)}
    >
      Pagar orden
    </button>
    <button
      className="btn btn-danger"
      onClick={() => handleCancelOrder(order.id)}
    >
      Cancelar pedido
    </button>
  </div>
)}
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
