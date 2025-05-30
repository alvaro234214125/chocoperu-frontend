import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem('token');

  const loadCartCount = () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    axios.get('http://localhost:8080/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCartCount(res.data.length);
    })
    .catch(() => setCartCount(0));
  };

  useEffect(() => {
    loadCartCount();
  }, [token]);

  return (
    <CartContext.Provider value={{ cartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
