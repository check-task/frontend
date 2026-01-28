import { create } from 'zustand';

interface CalendarState {
  currentYear: number;
  currentMonth: number;
  setDate: (year: number, month: number) => void;
  viewingYear: number; // MonthPicker에서 보고 있는 년도
  setViewingYear: (year: number) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>()((set) => ({
  currentYear: now.getFullYear(),
  currentMonth: now.getMonth() + 1, // 1-indexed (1월 = 1)
  viewingYear: now.getFullYear(),

  setDate: (year, month) =>
    set({ currentYear: year, currentMonth: month, viewingYear: year }),
  setViewingYear: (year) => set({ viewingYear: year }),
}));
