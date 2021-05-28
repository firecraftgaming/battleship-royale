import create from "zustand";

export const useUsernameStore = create(set => ({
  username: '',
  setUsername: (username: string) => set({ username }),
}))