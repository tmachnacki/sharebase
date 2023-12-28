import { create } from "zustand";
import { UserDocument } from "@/types";

type IAuthStore = {
  user: UserDocument | null;
  login: (user: UserDocument) => void;
  logout: () => void;
  setUser: (user: UserDocument) => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const localUser = localStorage.getItem("user-info");
  const authStore: IAuthStore = {
    user: localUser ? JSON.parse(localUser) : null,
    login: (user: UserDocument) => set({ user }),
    logout: () => set({ user: null }),
    setUser: (user: UserDocument) => set({ user }),
  };
  return authStore;
});

export { useAuthStore, type IAuthStore };
