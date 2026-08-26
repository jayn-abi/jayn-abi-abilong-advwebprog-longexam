import { useEffect, useState, useCallback } from 'react';
import { cartApi } from '../lib/api';
import { useAuth } from './auth-context';
import { CartContext } from './cart-context';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  const isCustomer = user?.type === 'customer';

  const refresh = useCallback(async () => {
    if (!isCustomer) return;
    const data = await cartApi.get();
    setCart(data);
  }, [isCustomer]);

  useEffect(() => {
    if (!isCustomer) return;
    cartApi.get().then(setCart).catch(() => {});
  }, [isCustomer]);

  const effectiveCart = isCustomer ? cart : null;

  const addItem = async (productId, quantity = 1) => {
    await cartApi.addItem(productId, quantity);
    await refresh();
  };

  const updateItem = async (productId, quantity) => {
    await cartApi.updateItem(productId, quantity);
    await refresh();
  };

  const removeItem = async (productId) => {
    await cartApi.removeItem(productId);
    await refresh();
  };

  const clear = async () => {
    await cartApi.clear();
    await refresh();
  };

  const itemCount = effectiveCart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart: effectiveCart, itemCount, refresh, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};
