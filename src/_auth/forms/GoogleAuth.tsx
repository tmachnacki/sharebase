import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { auth, firestore } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { UserDocument } from "@/types";
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const GoogleAuth = ({ isSignIn }: { isSignIn: boolean }) => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const handleSignInWithGoogle = async () => {
    try {
      const newUser = await signInWithGoogle();

      if (!newUser) {
        if (error) {
          toast({
            title: "Unable to log in with Google",
            description: `${error.message}`,
          });
        }
        return;
      }

      const userRef = doc(firestore, "users", newUser.user.uid);
      const userSnapShot = await getDoc(userRef);

      let userDoc: UserDocument | DocumentData | null;
      if (userSnapShot.exists()) {
        userDoc = userSnapShot.data();
      } else {
        userDoc = {
          uid: newUser.user.uid,
          email: newUser.user?.email ?? "",
          username: newUser.user?.email?.split("@")[0] ?? "",
          fullName: newUser.user?.displayName ?? "",
          bio: "",
          profilePicUrl: newUser.user?.photoURL ?? "",
          profileBannerUrl: "",
          followers: [],
          following: [],
          posts: [],
          saves: [],
          tagged: [],
          createdAt: new Date(Date.now()),
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
      }
      localStorage.setItem("user-info", JSON.stringify(userDoc));
      loginUser(userDoc);
      toast({ title: "Logged in successfully" });
      navigate("/");
    } catch (error) {
      toast({ title: "Unable to log in with Google", description: `${error}` });
    }
  };

  return (
    <Button
      variant={"secondary"}
      className="w-full"
      disabled={loading}
      onClick={handleSignInWithGoogle}
    >
      <img src="/google.png" alt="Google icon" className="w-4 h-4 mr-2" />
      {isSignIn ? "Log in" : "Sign up"} with Google
    </Button>
  );
};

export { GoogleAuth };
