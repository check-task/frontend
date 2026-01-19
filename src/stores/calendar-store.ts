import { create } from 'zustand';

interface CalendarState {
  currentYear: number;
  currentMonth: number;
  setDate: (year: number, month: number) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>()((set) => ({
  currentYear: now.getFullYear(),
  currentMonth: now.getMonth() + 1, // 1-indexed (1월 = 1)

  setDate: (year, month) => set({ currentYear: year, currentMonth: month }),
}));
