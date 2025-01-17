import { create } from 'zustand';

interface SwiperState {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  getCurrentIndex: () => number;
}

export const useSwiperState = create<SwiperState>((set,get) => ({
  currentIndex: 0,
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  getCurrentIndex: () => get().currentIndex,
}));
