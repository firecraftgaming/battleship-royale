import create from "zustand";
import { randomize } from "../lib/BoatFuntions";
import { Boat } from "../lib/BoatModels";

export interface BoatStoreType {
  boats: Boat[],
  setBoats: (boats: Boat[]) => void,
}

export const useBoatStore = create(set => ({
  boats: randomize(),
  setBoats: boats => set({ boats }),
} as BoatStoreType))