import { useState } from "react";
import { toast } from "sonner";
import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { UserDocument } from "@/types";

const useSearchUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState<UserDocument | DocumentData | null>(null);

	const getUserProfile = async (username: string) => {
		setIsLoading(true);
		setUser(null);
		try {
			const q = query(collection(firestore, "users"), where("username", "==", username));

			const querySnapshot = await getDocs(q);
			// if (querySnapshot.empty) return toast.error("Error", {description: "No users found"});
			if (querySnapshot.empty) {
				setUser(null);
				setIsLoading(false)
				return;
			}

			querySnapshot.forEach((doc: DocumentData) => {
				setUser(doc.data());
			});
			setIsLoading(false);
		} catch (error) {
			toast.error("Error", {description: `${error}`});
			setUser(null);
			setIsLoading(false);
		} 
	};

	return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;