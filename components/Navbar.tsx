"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ChangeBibleVersions from "./ChangeBibleVersions";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 w-full z-10 bg-yellow-300 backdrop-blur-md p-4 border-b-3 border-black flex flex-row justify-between items-center ">
      <Link
        href={"/"}
        className="uppercase italic text-xl font-bold flex gap-3 items-center"
      >
        <Button className="w-9 bg-red-500 border-2 -rotate-5">
          <Zap fill="white" />
        </Button>
        <span className="hidden lg:block">PRAYERCARE</span>
      </Link>
      <div className="flex items-center">
        <Link href={"/"} className={pathname === "/" ? " bg-yellow-200" : ""}>
          <Button variant={"link"} className="">
            Prayer Board
          </Button>
        </Link>

        <Link
          href={"/my-prayers"}
          className={pathname === "/my-prayers" ? "bg-yellow-200 mr-4" : "mr-4"}
        >
          <Button variant={"link"}>My Prayers</Button>
        </Link>
        <ChangeBibleVersions />
      </div>
    </header>
  );
}
