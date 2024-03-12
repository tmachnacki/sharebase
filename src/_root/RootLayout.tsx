import { Outlet } from "react-router-dom";

import { Nav } from "@/components/nav/nav";

const RootLayout = () => {
  return (
    <>
      <div className="relative md:flex w-full max-h-screen">
        <Nav />

        <section className="flex flex-1 w-full h-full max-h-screen px-4 md:px-6">
          <Outlet />
        </section>
      </div>
    </>
  );
};

export { RootLayout };
