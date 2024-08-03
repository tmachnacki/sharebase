import { Outlet } from "react-router-dom";

import { Nav } from "@/components/nav/nav";

const RootLayout = () => {
  return (
    <>
      <div className="relative block max-h-screen w-full md:flex">
        <Nav />

        <section className="flex h-full max-h-screen w-full flex-1 overflow-hidden">
          <Outlet />
        </section>
      </div>
    </>
  );
};

export { RootLayout };
