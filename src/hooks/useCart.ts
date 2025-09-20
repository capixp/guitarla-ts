import { useEffect, useState, useMemo } from "react";
import type { CarItem, Guitar } from "../types/index";
import { db } from "../data/db";
export const useCart = () => {
  const initialCart = () :CarItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item:Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updateCart = [...cart];
      updateCart[itemExists].quantity++;
      setCart(updateCart);
    } else {
      const newItem : CarItem = {...item,quantity : 1}
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar['id']) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updateCartAfterDecrease = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCartAfterDecrease);
  }

  function clearCart() {
    setCart([]);
  }

  // Carrito vacío
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  // Total a pagar
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  // Total de items (para el badge)
  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
    totalItems,
  };
};
