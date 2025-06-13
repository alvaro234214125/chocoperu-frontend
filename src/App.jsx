import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import MyProducts from './pages/MyProducts';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />
       <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
    
  );
}

export default App;