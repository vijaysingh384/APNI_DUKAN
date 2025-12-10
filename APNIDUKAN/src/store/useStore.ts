import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  shopId: string;
  shopName: string;
}

interface StoreState {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

// Load cart from localStorage on initialization
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('apni-dukan-cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('apni-dukan-cart', JSON.stringify(cart));
  } catch {
    // Ignore storage errors
  }
};

export const useStore = create<StoreState>((set, get) => ({
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  cart: loadCartFromStorage(),
  addToCart: (item) => {
    const cart = get().cart;
    const existingItem = cart.find((i) => i.productId === item.productId);
    let newCart: CartItem[];
    if (existingItem) {
      newCart = cart.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }
    set({ cart: newCart });
    saveCartToStorage(newCart);
  },
  removeFromCart: (itemId) => {
    const newCart = get().cart.filter((item) => item.id !== itemId);
    set({ cart: newCart });
    saveCartToStorage(newCart);
  },
  updateCartItemQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    const newCart = get().cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    saveCartToStorage(newCart);
  },
  clearCart: () => {
    set({ cart: [] });
    saveCartToStorage([]);
  },
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getCartItemCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
