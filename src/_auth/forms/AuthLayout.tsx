import { Outlet, Navigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const AuthLayout = () => {
  const [authUser] = useAuthState(auth);
  return (
    <>
      {authUser ? (
        <Navigate to="/" />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center flex-1">
            <Outlet />
          </div>

          <img src="" alt="image palceholder" className="hidden object-cover w-1/2 bg-no-repeat xl:block " />
        </>
      )}
    </>
  )
}

export { AuthLayout };