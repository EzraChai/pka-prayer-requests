import Link from "next/link";
import { Button } from "./ui/button";
import ChangeBibleVersions from "./ChangeBibleVersions";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10  bg-yellow-300 backdrop-blur-md p-4 border-b-3 border-black flex flex-row justify-between items-center ">
      <div className="uppercase text-xl font-semibold">PKA Prayer Board</div>
      <div className="flex items-center">
        <Link href={"/"}>
          <Button variant={"link"} className="">
            Prayer Board
          </Button>
        </Link>

        <Link href={"/my-prayers"}>
          <Button variant={"link"}>My Prayers</Button>
        </Link>
        <ChangeBibleVersions />
      </div>
    </header>
  );
}
