import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";

const useSavePost = (postId: string) => {
	const [isSaving, setIsSaving] = useState(false);
  const authUser  = useAuthStore((state) => state.user);
  const setUser  = useAuthStore((state) => state.setUser);
	const isSaved = authUser?.saves.includes(postId);

	const handleSavePost = async () => {
		if (isSaving) return;
		if (!authUser) return toast.error("Error", { description: "you must be logged in to save a post" });
		setIsSaving(true);

		try {
      // get auth user ref
      const authUserRef = doc(firestore, "users", authUser.uid);
      // update auth user doc saves
      await updateDoc(authUserRef, {
        saves: isSaved ? arrayRemove(postId) : arrayUnion(postId)
      })

      // update zustand auth user state
      setUser({
        ...authUser,
        saves: isSaved ? authUser.saves.filter((id: string) => id !== postId) : [...authUser.saves, postId]
      })
      setIsSaving(false);
		} catch (error) {
      toast.error("Error", { description: `${error}` });
      setIsSaving(false);
		} 
	};

	return { isSaving, isSaved, handleSavePost };
};

export { useSavePost };
