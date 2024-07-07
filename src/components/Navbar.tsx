"use client";

import { Button } from "./ui/button";

const Navbar = ({ signout }: { signout: () => void }) => {
  return (
    <nav className="bg-slate-200 p-5">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">Welcome</span>
        <Button onClick={signout}>Signout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
