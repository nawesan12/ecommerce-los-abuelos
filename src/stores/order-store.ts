import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/src/stores/cart-store";

export type OrderStatus = "paid" | "pending" | "failed";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentId?: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: "orders-storage",
    }
  )
);