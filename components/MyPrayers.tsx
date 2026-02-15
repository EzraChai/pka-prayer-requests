"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerEditCard from "./PrayerEditCard";

export default function MyPrayers() {
  const userId = localStorage.getItem("userId");
  const prayers = useQuery(api.myFunctions.getAllPrayersById, {
    userId: userId ?? "",
  });

  if (typeof prayers == "undefined") {
    return <div className="">Loading</div>;
  } else {
    return prayers.length > 0 ? (
      <div className=" min-h-90 mt-8 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-12 py-4">
        {prayers.map((prayer) => (
          <PrayerEditCard prayer={prayer} key={prayer._id} />
        ))}
      </div>
    ) : (
      <div className="mt-12 text-center py-4">
        No prayers found. Add your prayer now!
      </div>
    );
  }
}
