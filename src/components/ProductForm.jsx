import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductForm({ product, onChange, onSubmit }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error al cargar categorías:', err));
  }, []);

  const labelClass = 'block mb-1 font-medium text-gray-700';
  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <div>
        <label className={labelClass}>Nombre del producto</label>
        <input
          className={inputClass}
          placeholder="Ej. Zapatillas Nike Air"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          className={inputClass}
          placeholder="Describe tu producto"
          value={product.description}
          onChange={(e) =>
            onChange({ ...product, description: e.target.value })
          }
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio (S/)</label>
          <input
            className={inputClass}
            type="number"
            placeholder="0.00"
            value={product.price}
            onChange={(e) => onChange({ ...product, price: e.target.value })}
            required
            min={0}
          />
        </div>

        <div>
          <label className={labelClass}>Stock</label>
          <input
            className={inputClass}
            type="number"
            placeholder="Cantidad disponible"
            value={product.stock}
            onChange={(e) => onChange({ ...product, stock: e.target.value })}
            required
            min={0}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Categoría</label>
        <select
          className={inputClass}
          value={product.categoryId}
          onChange={(e) =>
            onChange({ ...product, categoryId: e.target.value })
          }
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>URL de la imagen</label>
        <input
          className={inputClass}
          placeholder="https://..."
          value={product.imageUrl}
          onChange={(e) =>
            onChange({ ...product, imageUrl: e.target.value })
          }
        />
      </div>

      {product.imageUrl && (
        <div className="mt-4">
          <label className="block mb-2 text-gray-700 font-medium">
            Vista previa de imagen
          </label>
          <img
            src={product.imageUrl}
            alt="Vista previa"
            className="w-full max-w-xs rounded-lg shadow-md border border-gray-200"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
      >
        Guardar Producto
      </button>
    </form>
  );
}

export default ProductForm;
