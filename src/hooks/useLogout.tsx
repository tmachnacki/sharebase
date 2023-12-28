import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const useLogout = () => {
  const [signOut, isLoggingOut, error] = useSignOut(auth);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      const loggedOut = await signOut();
      if (error) {
        console.log(error);
        toast({ title: "Unable to log out", description: `${error.message}` });
        return;
      }
      if (loggedOut) {
        localStorage.removeItem("user-info");
        logoutUser();
        navigate("/sign-in");
      } 
    } catch (error) {
      console.log(error);
      toast({ title: "Unable to log out" });
    }
  };

  return { handleLogout, isLoggingOut, error };
};

export { useLogout };