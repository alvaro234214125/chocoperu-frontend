import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/auth/me", { headers })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products", { headers })
      .then((res) => setProducts(res.data))
      .finally(() => setLoadingProducts(false));
  }, []);

  if (loadingUser || loadingProducts) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-white border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {user && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">
            Bienvenido <span className="text-blue-600">{user.username}</span>!
          </h2>
          <p className="text-gray-500">¡Explora el catálogo de productos!</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center mt-16 text-gray-500">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 w-full relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/default.png")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col h-[200px]">
                <h3 className="text-lg font-semibold truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description?.substring(0, 80)}...
                </p>
                <p className="text-blue-600 font-bold mt-2">
                  S/ {product.price}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md text-center"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
