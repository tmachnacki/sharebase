import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-col flex-1 justify-center items-center">
            <Outlet />
          </section>

          <img src="" alt="image palceholder" className="hidden xl:block w-1/2 object-cover bg-no-repeat " />
        </>
      )}
    </>
  )
}

export { AuthLayout };