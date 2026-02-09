"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ChangeBibleVersions from "./ChangeBibleVersions";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10  bg-yellow-300 backdrop-blur-md p-4 border-b-3 border-black flex flex-row justify-between items-center ">
      <Link href={"/"} className="uppercase text-xl font-semibold">
        PKA Prayer Board
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
