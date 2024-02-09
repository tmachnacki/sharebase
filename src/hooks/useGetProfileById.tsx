import { useEffect, useState } from "react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { UserDocument } from "@/types";

const useGetUserProfileById = (userId?: string) => {
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [userProfile, setUserProfile] = useState<UserDocument | DocumentData | null>(null);

	useEffect(() => {
		const getUserProfile = async () => {
      if (!userId) return;
			setIsLoadingUser(true);
			setUserProfile(null);
			try {
				const userDoc = await getDoc(doc(firestore, "users", userId));
				if (userDoc.exists()) {
					setUserProfile(userDoc.data());
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