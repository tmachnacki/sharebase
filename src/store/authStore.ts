import { create } from "zustand";
import { UserDocument } from "@/types";
import { DocumentData } from "firebase/firestore";

type IAuthStore = {
  user: UserDocument | DocumentData | null;
  login: (user: UserDocument | DocumentData | null) => void;
  logout: () => void;
  setUser: (user: UserDocument | DocumentData |  null) => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const localUser = localStorage.getItem("user-info");
  const authStore: IAuthStore = {
    user: localUser ? JSON.parse(localUser) : null,
    login: (user: UserDocument | DocumentData | null) => set({ user }),
    logout: () => set({ user: null }),
    setUser: (user: UserDocument | DocumentData | null) => set({ user }),
  };
  return authStore;
});

export { useAuthStore, type IAuthStore };
