"use client";

import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@/components/Navbar";
import PrayerCard from "@/components/PrayerCard";
import { AddNewPrayerForm } from "../components/addForm";
import { useEffect, useState } from "react";
import { PrayerWithStatus } from "@/convex/myFunctions";

export default function Home() {
  const getPrayers = useAction(api.myFunctions.getAllPrayers);

  const [prayersData, setPrayersData] = useState<PrayerWithStatus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const data = userId ? await getPrayers({ userId }) : await getPrayers({});

      setPrayersData(data);
    };
    fetchData();
  }, [getPrayers]);
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

        <div className=" columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {prayersData
            ? prayersData.map((prayer) => (
                <PrayerCard key={prayer._id} prayer={prayer} />
              ))
            : null}
        </div>
        <div className="fixed bottom-12 right-12">
          <AddNewPrayerForm />
        </div>
      </main>
    </>
  );
}
