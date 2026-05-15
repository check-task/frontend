import { create } from 'zustand';
import { ReactNode } from 'react';

// 모달을 열 때 넘겨줄 것들
interface ModalOptions {
  title?: string;
  content: ReactNode; // 모달 내부 내용
  headerType?: 'none' | 'withClose' | 'withCheck';
  onRightClick?: () => void;
  presentation?: 'default' | 'bare';
}

// 모달 상태
interface ModalState {
  isOpen: boolean;
  options: ModalOptions | null;
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  options: null,

  // openModal({ title:.., content:.. }) 식으로 호출
  openModal: (options) => set({ isOpen: true, options }),

  // 모달을 닫을 때 상태도 초기화
  closeModal: () => set({ isOpen: false, options: null }),
}));
