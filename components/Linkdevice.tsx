"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { ConvexError } from "convex/values";
import { Link2, Loader, Link2Off } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function LinkDevice({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = use(searchParams);
  const [statusCode, setStatusCode] = useState("LINKING");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const verifyToken = useAction(api.myFunctions.verifyToken);

  useEffect(() => {
    if (!params.token) {
      router.replace("/");
      return;
    }
    async function verifyTokenAndSet(token: string) {
      try {
        const result = await verifyToken({
          userId: localStorage.getItem("userId") || "",
          token: token,
        });
        if (result) {
          localStorage.setItem("userId", result);
          setStatusCode("SUCCESS");
        }
      } catch (error) {
        const { message, code } =
          error instanceof ConvexError
            ? (error.data as { message: string; code: string })
            : { message: "Unexpected error occurred", code: "UNEXPECTED" };
        setError(message);
        setStatusCode(code);
      }
    }

    verifyTokenAndSet(params.token);
  }, []);
  return (
    <div className="mt-24 w-full flex flex-col justify-center items-center p-12 text-center">
      {statusCode === "SUCCESS" && (
        <Card className=" bg-lime-400 mt-12 w-sm md:w-lg p-8 text-white font-bold flex flex-col items-center">
          <button className=" px-4 w-24 h-24 flex justify-center items-center bg-yellow-300 text-black border-3 border-black rotate-3  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ">
            <Link2 className="w-24 h-24" />
          </button>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold text-black">
            Device Linked
          </h3>

          <h2 className=" text-3xl md:text-5xl font-black -rotate-2 mt-3 bg-yellow-300 text-black px-2 ">
            Successfully
          </h2>
          <div className="mt-4">
            <p className="text-neutral-800">
              Your device has been successfully linked.
            </p>
            <Button
              onClick={() => router.replace("/my-prayers")}
              className="w-full md:w-sm mt-4 text-xl font-bold py-8 bg-neutral-800 border-3"
            >
              My Prayers
            </Button>
          </div>
        </Card>
      )}
      {statusCode === "LINKING" && (
        <div className="mt-52 flex flex-col items-center">
          <Loader className="w-24 h-24 animate-spin" />
          <p>Linking your device...</p>
        </div>
      )}
      {error && (
        <Card className="bg-red-500 mt-12 w-sm md:w-lg p-8 text-white font-bold flex flex-col items-center">
          <button className="px-4 w-24 h-24 flex justify-center items-center bg-yellow-300 text-black border-3 border-black rotate-3  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ">
            <Link2Off className="w-24 h-24" />
          </button>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold">
            Oppss... We have a{" "}
          </h3>

          <h2 className=" text-4xl md:text-5xl font-black -rotate-2 mt-3 bg-yellow-300 text-black px-2 ">
            Linking Problem
          </h2>
          <p className="bg-white w-full md:w-sm text-left border-3 border-black text-neutral-800 p-4 mt-6">
            <span className="underline">Error:</span> <br />
            {error}
          </p>
          <Button
            onClick={() => router.replace("/")}
            className="w-full md:w-sm mt-4 text-xl font-bold py-8 bg-neutral-800 border-3"
          >
            Home
          </Button>
        </Card>
      )}
    </div>
  );
}
