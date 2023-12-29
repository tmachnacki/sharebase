import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1">
        <Outlet />
      </div>

      <img
        src=""
        alt="image palceholder"
        className="hidden object-cover w-1/2 bg-no-repeat xl:block "
      />
    </>
  );
};

export { AuthLayout };
