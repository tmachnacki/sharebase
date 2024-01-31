import { useEffect, useState } from "react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";

const useGetUserProfileById = (userId?: string) => {
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [userProfile, setUserProfile] = useState<DocumentData | null>(null);

	useEffect(() => {
		const getUserProfile = async () => {
      if (!userId) return;
			setIsLoadingUser(true);
			setUserProfile(null);
			try {
				const userRef = await getDoc(doc(firestore, "users", userId));
				if (userRef.exists()) {
					setUserProfile(userRef.data());
				}
			} catch (error) {
				toast.error("Error", {description: `${error}`})
			} finally {
				setIsLoadingUser(false);
			}
		};
		getUserProfile();
	}, [setUserProfile, userId]);

	return { isLoadingUser, userProfile, setUserProfile };
};

export { useGetUserProfileById };