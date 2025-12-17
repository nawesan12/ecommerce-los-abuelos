import { create } from "zustand";

interface LikedStore {
  likedIds: string[];
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
}

export const useLikedStore = create<LikedStore>((set, get) => ({
  likedIds: [],

  toggleLike: (productId) =>
    set((state) => ({
      likedIds: state.likedIds.includes(productId)
        ? state.likedIds.filter((id) => id !== productId)
        : [...state.likedIds, productId],
    })),

  isLiked: (productId) => get().likedIds.includes(productId),
}));