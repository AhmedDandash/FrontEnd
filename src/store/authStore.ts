import { create } from 'zustand';

interface AuthStore {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isHydrated: boolean;
  setIsHydrated: (hydrated: boolean) => void;
}

// Initialize language from localStorage if available
const getInitialLanguage = (): 'ar' | 'en' => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'ar' || savedLang === 'en') {
      return savedLang;
    }
  }
  return 'ar';
};

export const useAuthStore = create<AuthStore>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (lang) => set({ language: lang }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isHydrated: false,
  setIsHydrated: (hydrated) => set({ isHydrated: hydrated }),
}));
