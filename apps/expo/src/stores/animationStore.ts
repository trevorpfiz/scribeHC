import { create } from "zustand";

interface AnimationState {
  isFanningOut: boolean;
  ballColor: string;
  toggleFanningOut: () => void;
  setFanningOut: (isFanningOut: boolean) => void;
  setBallColor: (color: string) => void;
}

export const useAnimationStore = create<AnimationState>()((set) => ({
  isFanningOut: false,
  ballColor: "black",
  toggleFanningOut: () =>
    set((state) => ({ isFanningOut: !state.isFanningOut })),
  setFanningOut: (isFanningOut) => set({ isFanningOut }),
  setBallColor: (color: string) => set({ ballColor: color }),
}));

// Example persist-middleware with MMKV
// export const useAnimationStore = create<AnimationState>()(
//   persist(
//     (set) => ({
//       isFanningOut: false,
//       toggleFanningOut: () =>
//         set((state) => ({ isFanningOut: !state.isFanningOut })),
//       setFanningOut: (isFanningOut) => set({ isFanningOut }),
//     }),
//     {
//       name: "animation-storage", // unique name
//       storage: createJSONStorage(() => zustandStorage),
//     },
//   ),
// );
