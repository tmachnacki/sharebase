import { Outlet } from "react-router-dom";

import { Nav } from "@/components/nav/nav";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const RootLayout = () => {
  const [authUser] = useAuthState(auth);
  return (
    <>
      {authUser ? (
        <div className="flex w-full max-h-screen">
          <Nav />

          <section className="flex flex-1 w-full h-full max-h-screen ">
            <Outlet />
          </section>
        </div>
      ) : (
        <Navigate to={"/sign-in"} />
      )}
    </>
  );
};

export { RootLayout };
