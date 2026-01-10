import Cookies from 'js-cookie';
import { StateStorage } from 'zustand/middleware';

// 쿠키 기반 Zustand Storage
// 쿠키를 사용하여 서버사이드에서도 상태를 읽을 수 있도록 함
// 초기 렌더링 시 깜빡임방지
export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 365, // 1년
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
