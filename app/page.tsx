"use client";

import { Preloaded, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import PrayerCard from "@/components/PrayerCard";
import { Button } from "@/components/ui/button";
import { Plus, PlusIcon } from "lucide-react";

export default function Home() {
  const prayers = useQuery(api.myFunctions.getAllPrayers);
  console.log(prayers);
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <section>
          <h1 className="text-4xl font-bold">PKA Prayer Board</h1>
          <p className="mt-2">
            Welcome to the PKA Prayer Board. Share your prayers and support
            others in their spiritual journey.
          </p>
        </section>

        <div className="grid columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {prayers
            ? prayers.map((prayer) => (
                <PrayerCard key={prayer._id} prayer={prayer} />
              ))
            : null}
        </div>
        <div className="fixed bottom-12 right-12">
          <Button className=" text-3xl bg-neutral-800 border-3 font-black p-8">
            + Prayer
          </Button>
        </div>
      </main>
    </>
  );
}
