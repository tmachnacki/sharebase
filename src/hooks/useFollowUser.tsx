import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { firestore } from "@/lib/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const useFollowUser = (userId: string) => {
	const [followPending, setFollowPending] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const { userProfile, setUserProfile } = useUserProfileStore();
	const { username } = useParams();



	const handleFollowUser = async () => {
    if(!authUser) return;
		console.log(userProfile);
		console.log(username);
		setFollowPending(true);
		try {
			const currentUserRef = doc(firestore, "users", authUser.uid);
			const userToFollowOrUnfollowRef = doc(firestore, "users", userId);
			await updateDoc(currentUserRef, {
				following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
			});

			await updateDoc(userToFollowOrUnfollowRef, {
				followers: isFollowing ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			if (isFollowing) {
				// unfollow
				setAuthUser({
					...authUser,
					following: authUser.following.filter((uid: string) => uid !== userId),
				});
				if (userProfile && username && username === userProfile.username)
					setUserProfile({
						...userProfile,
						followers: userProfile.followers.filter((uid: string) => uid !== authUser.uid),
					});

				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						following: authUser.following.filter((uid: string) => uid !== userId),
					})
				);
				setIsFollowing(false);
			} else {
				// follow
				setAuthUser({
					...authUser,
					following: [...authUser.following, userId],
				});

				if (userProfile && username && username === userProfile.username)
					setUserProfile({
						...userProfile,
						followers: [...userProfile.followers, authUser.uid],
					});

				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						following: [...authUser.following, userId],
					})
				);
				setIsFollowing(true);
			}
		} catch (error) {
			toast.error("Error", {description: `${error}`});
		} finally {
			setFollowPending(false);
		}
	};

	useEffect(() => {
		if (authUser) {
			const isFollowing = authUser.following.includes(userId);
			setIsFollowing(isFollowing);
		}
	}, [authUser, userId]);

	return { followPending, isFollowing, handleFollowUser };
};

export { useFollowUser };