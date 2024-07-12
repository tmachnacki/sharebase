import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { useUserProfileStore } from "@/store/userProfileStore";

const useLogout = () => {
  const [signOut, isLoggingOut, error] = useSignOut(auth);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const setPosts = usePostStore((state) => state.setPosts);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const handleLogout = async () => {
    try {
      const loggedOut = await signOut();
      if (error) {
        console.log(error);
        toast.error("Unable to log out", { description: `${error.message}` });
        return;
      }
      if (loggedOut) {
        localStorage.removeItem("user-info");
        logoutUser();
        setPosts([]);
        setUserProfile(null);
        navigate("/sign-in");
      } 
    } catch (error) {
      console.log(error);
      toast.error("Unable to log out");
    }
  };

  return { handleLogout, isLoggingOut, error };
};

export { useLogout };