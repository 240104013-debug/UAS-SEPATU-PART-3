import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/database';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string | number, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  lastAddedProduct: { product: Product; size: string | number; color: string } | null;
  dismissNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tokorizal_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastAddedProduct, setLastAddedProduct] = useState<{ product: Product; size: string | number; color: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart in localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, size: string | number, color: string, quantity: number = 1) => {
    const itemId = `${product.id}-${size}-${color.replace(/\s+/g, '_')}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const currentQty = updated[existingIndex].quantity;
        const availableStock = product.stock;
        const nextQty = Math.min(currentQty + quantity, availableStock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: nextQty
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            size,
            color,
            quantity: Math.min(quantity, product.stock)
          }
        ];
      }
    });

    setLastAddedProduct({ product, size, color });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const clamped = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const dismissNotification = () => {
    setLastAddedProduct(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastAddedProduct,
        dismissNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
