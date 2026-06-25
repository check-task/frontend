import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const getHomeFilterStorage = () =>
  typeof window === 'undefined' ? noopStorage : window.localStorage;

interface HomeFilterState {
  selectedFolderIds: number[] | null;
  setSelectedFolderIds: (ids: number[] | null) => void;
}

export const useHomeFilterStore = create<HomeFilterState>()(
  persist(
    (set) => ({
      selectedFolderIds: null,
      setSelectedFolderIds: (ids) => set({ selectedFolderIds: ids }),
    }),
    {
      name: 'home-filter-storage',
      storage: createJSONStorage(getHomeFilterStorage),
    },
  ),
);
