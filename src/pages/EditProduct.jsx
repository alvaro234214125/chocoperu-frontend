import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/products/${id}`, product, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/products');
  };

  if (!product) return <p className="container mt-4">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Producto</h2>
      <ProductForm product={product} onChange={setProduct} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditProduct;
