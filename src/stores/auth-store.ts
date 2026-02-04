import { User } from '@/types/api/user';
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;

  login: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  user: null,
  accessToken: null,

  login: (accessToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ isLoggedIn: true, accessToken });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    set({ isLoggedIn: false, user: null, accessToken: null });
  },

  setUser: (user: User) => {
    set({ user });
  },

  checkAuth: () => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('accessToken');
    if (token) {
      set({ isLoggedIn: true, accessToken: token });
      return true;
    }
    return false;
  },
}));
