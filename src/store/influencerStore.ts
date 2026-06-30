import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

interface InfluencerState {
  platform: Platform;
  searchQuery: string;
  lists: Record<string, UserProfileSummary[]>;
  activeList: string;
  theme: "light" | "dark";
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  createList: (name: string) => void;
  deleteList: (name: string) => void;
  setActiveList: (name: string) => void;
  addProfileToList: (listName: string, profile: UserProfileSummary) => void;
  removeProfileFromList: (listName: string, userId: string) => void;
  toggleTheme: () => void;
}

export const useInfluencerStore = create<InfluencerState>()(
  persist(
    (set) => ({
      platform: "instagram",
      searchQuery: "",
      lists: {
        "My Favorites": [],
      },
      activeList: "My Favorites",
      theme: "light",

      setPlatform: (platform) => set({ platform }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      createList: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || state.lists[trimmed]) return {};
          return {
            lists: { ...state.lists, [trimmed]: [] },
            activeList: trimmed,
          };
        }),

      deleteList: (name) =>
        set((state) => {
          const newLists = { ...state.lists };
          delete newLists[name];
          const remainingLists = Object.keys(newLists);
          const nextActive =
            remainingLists.length > 0 ? remainingLists[0] : "My Favorites";
          
          if (remainingLists.length === 0) {
            newLists["My Favorites"] = [];
          }

          return {
            lists: newLists,
            activeList: nextActive,
          };
        }),

      setActiveList: (activeList) => set({ activeList }),

      addProfileToList: (listName, profile) =>
        set((state) => {
          const list = state.lists[listName] || [];
          // Prevent duplicates
          if (list.some((p) => p.user_id === profile.user_id)) {
            return {};
          }
          return {
            lists: {
              ...state.lists,
              [listName]: [...list, profile],
            },
          };
        }),

      removeProfileFromList: (listName, userId) =>
        set((state) => {
          const list = state.lists[listName] || [];
          return {
            lists: {
              ...state.lists,
              [listName]: list.filter((p) => p.user_id !== userId),
            },
          };
        }),
    }),
    {
      name: "influencer-search-storage",
    }
  )
);
