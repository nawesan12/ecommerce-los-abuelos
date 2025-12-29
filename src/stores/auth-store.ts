"use client";
import { create } from "zustand";

interface UserData {
    name: string;
    apellido: string;
    email: string;
    telefono: string;
    dni:string;
    points?: number;
}

interface AuthState {
    user: UserData | null;
    login: (user: UserData) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () =>
        set({
            user: null,
        }),
}));
