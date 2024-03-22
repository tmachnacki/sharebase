import { Outlet } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";

const AuthLayout = () => {
  return (
    <AuroraBackground className="w-screen relative">
      <div className="flex flex-col items-center justify-center flex-1 w-full z-10">
        <Outlet />
      </div>
    </AuroraBackground>
  );
};

export { AuthLayout };
