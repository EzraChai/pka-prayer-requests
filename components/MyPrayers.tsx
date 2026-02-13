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
    return (
      <div className=" columns-1 md:columns-2 lg:columns-3 xl:columns-4 p-4 gap-4">
        {prayers.map((prayer) => (
          <PrayerEditCard prayer={prayer} key={prayer._id} />
        ))}
      </div>
    );
  }
}
