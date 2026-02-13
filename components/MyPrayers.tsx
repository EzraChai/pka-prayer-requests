"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerEditCard from "./PrayerEditCard";

export default function MyPrayers() {
  const prayers = useQuery(api.myFunctions.getAllPrayersById, {
    userId:
      typeof window !== "undefined"
        ? (localStorage.getItem("userId") ?? "")
        : "",
  });
  if (typeof prayers == "undefined") {
    return <div className="">Loading</div>;
  } else {
    return prayers.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
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
