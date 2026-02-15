"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import PrayerCard from "@/components/PrayerCard";
import { AddNewPrayerForm } from "../components/addPrayerForm";
import { LanguageContext } from "@/components/LanguageContextProvider";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function Home() {
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";
  const prayers = useQuery(api.myFunctions.getAllPrayers, {
    userId:
      typeof window !== "undefined"
        ? (localStorage.getItem("userId") ?? "")
        : "",
  });

  return (
    <main className="p-12 flex flex-col">
      <section>
        <h1 className="text-4xl font-bold">PKA Prayer Care</h1>
        <p className="mt-2">
          Welcome to the PKA Prayer Care. Share your prayers and support others
          in their spiritual journey.
        </p>
      </section>

      <div className="min-h-150 w-full">
        {typeof prayers === "undefined" ? (
          <div className="mt-52 flex justify-center items-center ">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            {prayers && prayers.length > 0 ? (
              <div className="mt-8 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-12">
                {prayers.map((prayer) => (
                  <PrayerCard key={prayer._id} prayer={prayer} />
                ))}
              </div>
            ) : (
              <div className=" mt-52 flex justify-center items-center text-neutral-500 ">
                Add your prayer now!
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-12 right-12">
        <AddNewPrayerForm />
      </div>
      {lang === "en" && (
        <div className="text-xs text-neutral-500 ">
          <p className="">
            ESV® Bible (The Holy Bible, English Standard Version®), <br /> ©
            2001 by Crossway, a publishing ministry of Good News Publishers.{" "}
            <br /> Used by permission. All rights reserved.
          </p>
          <Link href="https://www.esv.org/">
            <Button variant={"link"} className="p-0 text-xs text-neutral-600">
              https://www.esv.org/
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
