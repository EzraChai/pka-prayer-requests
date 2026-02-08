import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---
export type LanguageState = {
  language: string;
};

export type LanguageActions = {
  changeLanguage: (language: string) => void;
};

export type LanguageStore = LanguageState & LanguageActions;

// --- Default ---
export const defaultLanguage: LanguageState = {
  language: "en", // default version
};

// --- Create store ---
export const createLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: defaultLanguage.language,
      changeLanguage: (language: string) => set({ language }),
    }),
    {
      name: "language-storage", // key in localStorage
    },
  ),
);
