import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: 'No estás autenticado',
        text: 'Debes iniciar sesión para editar productos.',
        icon: 'warning',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    console.log('ID recibido:', id);

    axios
      .get(`http://localhost:8080/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Producto cargado:', res.data);
        setProduct({
          ...res.data,
          price: res.data.price.toString(),
          stock: res.data.stock.toString(),
          categoryId: res.data.categoryId.toString(),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando producto:', err.response || err);
        Swal.fire({
          icon: 'error',
          title: 'Producto no encontrado',
          text: 'No se pudo cargar el producto.',
        });
        navigate('/my-products');
      });
  }, [id, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        categoryId: parseInt(product.categoryId),
      };

      await axios.put(
        `http://localhost:8080/products/${id}`,
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Producto actualizado correctamente');

      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado',
        text: 'Los cambios se guardaron correctamente.',
        confirmButtonText: 'Volver a mis productos',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate('/my-products');
      });
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el producto');
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Intenta nuevamente.',
      });
    }
  };

  if (loading || !product) {
    return (
      <p className="container mx-auto mt-8 text-center text-gray-700">
        Cargando producto...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Editar Producto</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
        >
          ← Volver
        </button>
      </div>

      <ProductForm
        product={product}
        onChange={setProduct}
        onSubmit={handleSubmit}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default EditProduct;
