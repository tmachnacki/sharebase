import { UserDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { create } from "zustand";

type IUserProfileStore = {
  userProfile: UserDocument | DocumentData | null;
  setUserProfile: (userProfile: UserDocument | DocumentData | null) => void;
}

const useUserProfileStore = create<IUserProfileStore>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile: UserDocument | DocumentData | null) => set({ userProfile }),
}))

export { useUserProfileStore, type IUserProfileStore };