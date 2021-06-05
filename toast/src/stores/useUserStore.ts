import create from "zustand";

export interface UserStoreType {
  id: string,
  username: string,
  setUser: (username: string, id: string) => void,
}

export const useUserStore = create(set => ({
  id: '',
  username: '',
  setUser: (username: string, id: string) => set({ username, id }),
}))