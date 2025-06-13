import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

function CreateProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: 'No estás autenticado',
        text: 'Debes iniciar sesión para crear productos.',
        icon: 'warning',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/login');
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        categoryId: parseInt(product.categoryId)
      };

      await axios.post('http://localhost:8080/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Producto creado exitosamente');

      Swal.fire({
        title: '¡Producto Creado!',
        text: 'Tu producto fue agregado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver mis productos',
        confirmButtonColor: '#2563eb'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-products');
        }
      });

    } catch (err) {
      console.error('Error al crear producto:', err);
      toast.error('Error al crear el producto');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Nuevo Producto</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
        >
          ← Volver
        </button>
      </div>

      <div >
        <ProductForm
          product={product}
          onChange={setProduct}
          onSubmit={handleSubmit}
        />
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default CreateProduct;
