function ProductForm({ product, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mb-3">
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Nombre"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Descripción"
          value={product.description}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Precio"
          type="number"
          value={product.price}
          onChange={(e) => onChange({ ...product, price: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Categoría"
          value={product.category?.name || ''}
          onChange={(e) =>
            onChange({ ...product, category: { ...product.category, name: e.target.value } })
          }
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">Guardar</button>
    </form>
  );
}

export default ProductForm;
