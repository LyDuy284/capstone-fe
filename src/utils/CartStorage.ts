interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  promotion: any;
  quantity: number;
  category: string;
}

const CART_KEY = 'cart';

export const getCart = (): CartItem[] => {
  const storedCart = localStorage.getItem(CART_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (!existingItem) {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const event = new CustomEvent('cartUpdated');
  window.dispatchEvent(event);
};

export const removeFromCart = (id: string): void => {
  let cart = getCart();
  cart = cart.filter((cartItem) => cartItem.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const event = new CustomEvent('cartUpdated');
  window.dispatchEvent(event);
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const updateCartItemQuantity = (id: string, quantity: number) => {
  const cart = getCart();
  const updatedCart = cart.map((item) =>
    item.id === id ? { ...item, quantity: quantity } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};
