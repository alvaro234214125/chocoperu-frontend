import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) return;

    axios.get('http://localhost:8080/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error al obtener pedidos:', err))
      .finally(() => setLoading(false));
  }, [user, token]);

  const reloadOrders = () => {
    setLoading(true);
    axios.get('http://localhost:8080/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  const handlePayOrder = (orderId) => {
    if (!window.confirm('¿Confirmas el pago de esta orden?')) return;

    axios.post(`http://localhost:8080/orders/${orderId}/pay`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert('Orden pagada con éxito');
        reloadOrders();
      })
      .catch(() => alert('Error al pagar la orden'));
  };

  const handleCancelOrder = (orderId) => {
    if (!window.confirm('¿Seguro que quieres cancelar este pedido?')) return;

    axios.post(`http://localhost:8080/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert('Pedido cancelado correctamente');
        reloadOrders();
      })
      .catch(() => alert('Error al cancelar el pedido'));
  };

  const filteredOrders = orders.filter(order =>
    filterStatus === 'ALL' || order.status === filterStatus
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) return <div className="container mx-auto mt-10 text-center text-gray-600">Cargando pedidos...</div>;
  if (orders.length === 0) return <div className="container mx-auto mt-10 text-center text-gray-600">No tienes pedidos aún.</div>;

  const filterBtnClass = (status) =>
    `px-4 py-2 rounded font-semibold transition ${
      filterStatus === status
        ? status === 'ALL' ? 'bg-blue-600 text-white' :
          status === 'PENDING' ? 'bg-yellow-400 text-yellow-900' :
          status === 'PAID' ? 'bg-green-600 text-white' :
          status === 'CANCELED' ? 'bg-red-600 text-white' : ''
        : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100'
    }`;

  const statusBadgeClass = (status) =>
    `inline-block px-3 py-1 rounded-full text-sm font-semibold ${
      status === 'PAID' ? 'bg-green-500 text-white' :
      status === 'PENDING' ? 'bg-yellow-300 text-yellow-900' :
      status === 'CANCELED' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
    }`;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Mis Pedidos</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        <button className={filterBtnClass('ALL')} onClick={() => setFilterStatus('ALL')}>Todos</button>
        <button className={filterBtnClass('PENDING')} onClick={() => setFilterStatus('PENDING')}>Pendientes</button>
        <button className={filterBtnClass('PAID')} onClick={() => setFilterStatus('PAID')}>Pagados</button>
        <button className={filterBtnClass('CANCELED')} onClick={() => setFilterStatus('CANCELED')}>Cancelados</button>
      </div>

      {currentOrders.map(order => (
        <div key={order.id} className="bg-white shadow-md rounded-lg mb-6 p-6 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 flex-1">
            <div>
              <h5 className="text-xl font-semibold mb-2">Pedido #{order.id}</h5>
              <p className="text-gray-600 mb-1">Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mb-1">
                Total: <strong>S/ {order.totalPrice.toFixed(2)}</strong>
              </p>
              <p>
                Estado: <span className={statusBadgeClass(order.status)}>{order.status}</span>
              </p>

              {order.status === 'PENDING' && (
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                    onClick={() => handlePayOrder(order.id)}
                  >
                    Pagar orden
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancelar pedido
                  </button>
                </div>
              )}
            </div>

            {order.items && order.items.length > 0 && (
              <div className="flex flex-col items-center md:items-end">
                <a
                  href={`/orders/${order.id}`}
                  className="mb-4 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition text-gray-700"
                >
                  Ver Detalle
                </a>
                <div className="flex items-center gap-4">
                  <img
                    src={order.items[0].productImage || '/default.png'}
                    alt={order.items[0].productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <span className="font-semibold">{order.items[0].productName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 border border-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 border border-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default MyOrders;
