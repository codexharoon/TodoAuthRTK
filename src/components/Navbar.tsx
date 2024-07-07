"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-slate-200 p-5">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">Welcome</span>
        <Button>Signout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
