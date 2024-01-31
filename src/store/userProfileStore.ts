import { PostDocument, UserDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { create } from "zustand";

type IUserProfileStore = {
  userProfile: UserDocument | DocumentData | null;
  setUserProfile: (userProfile: UserDocument | DocumentData | null) => void;
  addPost: (post: PostDocument | DocumentData | null) => void;
  deletePost: (postId: string) => void;
}

const useUserProfileStore = create<IUserProfileStore>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile: UserDocument | DocumentData | null) => set({ userProfile }),
  addPost: (post: PostDocument | DocumentData | null) => set((state) => ({ userProfile: { ...state.userProfile, posts: [post?.id, ...state?.userProfile?.posts ?? null] } })),
  deletePost: (postId: string) => set((state) => ({ userProfile: { ...state.userProfile, posts: state.userProfile?.posts.filter((id: string) => id !== postId) } }))
}))

export { useUserProfileStore, type IUserProfileStore };