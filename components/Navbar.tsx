"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ChangeBibleVersions from "./change-bible-versions";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, XIcon, Zap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full z-30 bg-yellow-300 backdrop-blur-md p-4 border-b-3 border-black flex flex-row justify-between items-center ">
      <div className="md:hidden">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            {!isOpen ? <MenuIcon /> : <XIcon />}
          </PopoverTrigger>
          <PopoverContent className="p-12 fixed top-4 bg-yellow-300 shadow-none border-0 -left-7 w-screen h-screen rounded-none flex flex-col items-center gap-8 z-30">
            <Button
              variant={"link"}
              onClick={() => {
                router.push("/");
                setIsOpen(false);
              }}
              className={
                pathname === "/"
                  ? " bg-yellow-200 w-full underline-none"
                  : "underline-none"
              }
            >
              <div className="text-4xl">Prayer Board</div>
            </Button>

            <Button
              variant={"link"}
              onClick={() => {
                router.push("/my-prayers");
                setIsOpen(false);
              }}
              className={
                pathname === "/my-prayers"
                  ? "bg-yellow-200  w-full underline-none"
                  : "underline-none"
              }
            >
              <div className="text-4xl">My Prayers</div>
            </Button>
            <ChangeBibleVersions />
          </PopoverContent>
        </Popover>
      </div>
      <Link
        href={"/"}
        className="uppercase italic text-xl font-bold flex gap-3 items-center"
      >
        <Button className="w-9 bg-red-500 border-2 -rotate-5">
          <Zap fill="white" />
        </Button>
        <span className="">PRAYERCARE</span>
      </Link>
      <div className="md:hidden"></div>
      <div className="hidden md:flex items-center">
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
