'use client';

import { create } from 'zustand';
import type { ReactNode } from 'react';

interface AlertItem {
  id: string;
  message: ReactNode;
}

interface AlertState {
  alerts: AlertItem[];
  showAlert: (message: ReactNode) => void;
  removeAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  showAlert: (message) => {
    const id = crypto.randomUUID();
    set((state) => ({ alerts: [...state.alerts, { id, message }] }));
    setTimeout(() => {
      set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
    }, 4000);
  },
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
