import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) return;
    fetchOrders();
  }, [user, token]);

  const fetchOrders = () => {
    setLoading(true);
    axios.get('http://localhost:8080/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error al obtener pedidos:', err))
      .finally(() => setLoading(false));
  };

  const handlePayClick = (order) => {
    setSelectedOrder(order);
    setCardNumber('');
    setShowPaymentModal(true);
  };

  const handlePayOrder = () => {
  const { cardHolderName, cardNumber, expiryDate, cvv } = selectedOrder;

  if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
    toast.warning('Por favor, completa todos los campos del formulario.');
    return;
  }

  axios.post(`http://localhost:8080/orders/${selectedOrder.id}/pay`, {
    cardHolderName,
    cardNumber,
    expiryDate,
    cvv,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(() => {
      toast.success('Pago exitoso');
      setShowPaymentModal(false);
      fetchOrders();
    })
    .catch(() => toast.error('Error al procesar el pago'));
};

const handleCancelOrder = async (orderId) => {
  const result = await MySwal.fire({
    title: '¿Cancelar pedido?',
    text: '¿Estás seguro de que quieres cancelar este pedido?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (result.isConfirmed) {
    axios.post(`http://localhost:8080/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        toast.success('Pedido cancelado correctamente');
        fetchOrders();
      })
      .catch(() => toast.error('Error al cancelar el pedido'));
  }
};

  const filteredOrders = orders.filter(order =>
    filterStatus === 'ALL' || order.status === filterStatus
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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

  if (loading) return <div className="text-center mt-10 text-gray-600">Cargando pedidos...</div>;
  if (orders.length === 0) return <div className="text-center mt-10 text-gray-600">No tienes pedidos aún.</div>;

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
              <p className="mb-1">Total: <strong>S/ {order.totalPrice.toFixed(2)}</strong></p>
              <p>Estado: <span className={statusBadgeClass(order.status)}>{order.status}</span></p>

              {order.status === 'PENDING' && (
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => handlePayClick(order)}
                  >
                    Pagar orden
                  </button>

                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
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
          className="px-4 py-2 border border-gray-400 rounded disabled:opacity-50 hover:bg-gray-100 transition"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 border border-gray-400 rounded disabled:opacity-50 hover:bg-gray-100 transition"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Siguiente
        </button>
      </div>

{showPaymentModal && selectedOrder && (
  <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        onClick={() => setShowPaymentModal(false)}
      >
        ✕
      </button>

      <h3 className="text-2xl font-bold mb-6">Pagar Pedido #{selectedOrder.id}</h3>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 border rounded p-4">
          <h4 className="text-lg font-semibold mb-3">Productos</h4>
          <ul className="space-y-3 max-h-64 overflow-auto">
            {selectedOrder.items.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <span>{item.productName} x {item.quantity}</span>
                <span>S/ {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-semibold text-lg">
            Total: S/ {selectedOrder.totalPrice.toFixed(2)}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            handlePayOrder();
          }}>
            <div>
              <label className="block font-medium mb-1">Nombre del titular</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Juan Pérez"
                value={selectedOrder.cardHolderName || ''}
                onChange={(e) => setSelectedOrder(prev => ({ ...prev, cardHolderName: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Número de tarjeta</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="1234 5678 9012 3456"
                minLength={19}
                value={selectedOrder.cardNumber || ''}
                onChange={(e) => setSelectedOrder(prev => ({ ...prev, cardNumber: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Fecha de expiración</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="MM/AA"
                  maxLength={5}
                  value={selectedOrder.expiryDate || ''}
                  onChange={(e) => setSelectedOrder(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">CVV</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="123"
                  maxLength={4}
                  value={selectedOrder.cvv || ''}
                  onChange={(e) => setSelectedOrder(prev => ({ ...prev, cvv: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
              >
                Finalizar Compra
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default MyOrders;
