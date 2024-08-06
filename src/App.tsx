import "./globals.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./_auth/forms/AuthLayout";
import { SigninForm } from "./_auth/forms/SigninForm";
import { SignupForm } from "./_auth/forms/SignupForm";
import { RootLayout } from "./_root/RootLayout";
import { Explore, Home, Profile, Saves } from "./_root/pages";

import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./store/authStore";

import { Loader2 } from "lucide-react";
import { PostDetails } from "./_root/pages/PostDetails";
import { ChatsPage } from "./_root/pages/ChatsPage";

const App = () => {
  const authUser = useAuthStore((state) => state.user);

  return (
    <main className={`flex h-screen bg-white dark:bg-gray-950`}>
      {/* toaster */}
      <Toaster
        richColors
        closeButton
        icons={{ loading: <Loader2 className="h-4 w-4" /> }}
        position="top-right"
      />

      <Routes>
        {/* protected */}
        <Route
          element={authUser ? <RootLayout /> : <Navigate to={"/sign-in"} />}
        >
          <Route index element={<Home />} />
          <Route path="/users/:username" element={<Profile />} />
          <Route path="/saved" element={<Saves />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/posts/:postid" element={<PostDetails />} />
          <Route path="/chats/" element={<ChatsPage />} />
        </Route>

        {/* public */}
        <Route element={authUser ? <Navigate to="/" /> : <AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
      </Routes>
    </main>
  );
};

export { App };
