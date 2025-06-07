import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');

  const fetchCart = () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    axios.get('http://localhost:8080/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCartItems(res.data))
    .catch(() => setCartItems([]));
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
