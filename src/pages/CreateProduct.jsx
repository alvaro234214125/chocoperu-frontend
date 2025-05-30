import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';

function CreateProduct() {
  const [product, setProduct] = useState({ name: '', description: '', price: '', category: {} });
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/products', product, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/products');
  };

  return (
    <div className="container mt-4">
      <h2>Crear Producto</h2>
      <ProductForm product={product} onChange={setProduct} onSubmit={handleSubmit} />
    </div>
  );
}

export default CreateProduct;
