'use client';

import { create } from 'zustand';
import type { ReactNode } from 'react';

interface AlertItem {
  id: string;
  message: ReactNode;
  variant?: 'check' | 'x';
}

interface AlertState {
  alerts: AlertItem[];
  showAlert: (message: ReactNode, variant?: 'check' | 'x') => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  showAlert: (message, variant = 'check') => {
    const id = crypto.randomUUID();
    set((state) => ({ alerts: [...state.alerts, { id, message, variant }] }));
    setTimeout(() => {
      set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
    }, 4000);
  },
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
