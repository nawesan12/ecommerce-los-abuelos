import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;              // ID DE LA VARIANTE
  productId: string;       // ID DEL PRODUCTO BASE
  title: string;
  price: number;
  image: string;
  variantWeight?: string;  // peso seleccionado
  quantity: number;
}

interface CartState {
  items: CartItem[];

  // ✔ Ahora también acepta los nuevos campos opcionales
  addItem: (
    product: Omit<CartItem, "quantity">,
    quantity?: number
  ) => void;

  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === product.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);