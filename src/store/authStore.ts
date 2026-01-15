import { create } from "zustand";

interface AuthStore {
  language: "ar" | "en";
  setLanguage: (lang: "ar" | "en") => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  language: "ar",
  setLanguage: (lang) => set({ language: lang }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
