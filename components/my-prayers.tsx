"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerEditCard from "./edit-prayer-card";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function MyPrayers() {
  const [userId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("userId");
    } catch {
      return null;
    }
  });

  const prayers = useQuery(api.myFunctions.getAllPrayersById, {
    userId: userId ?? "",
  });

  if (typeof prayers == "undefined") {
    return (
      <div className="text-center mt-24 flex justify-center items-center ">
        <Loader className="animate-spin" />
      </div>
    );
  } else {
    return prayers.length > 0 ? (
      <div className=" min-h-90 mt-4 md:mt-8 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-12 py-4">
        {prayers.map((prayer) => (
          <PrayerEditCard prayer={prayer} key={prayer._id} />
        ))}
      </div>
    ) : (
      <div className="mt-24 text-center py-4 text-neutral-500">
        No prayers found. Add your prayer now!
      </div>
    );
  }
}
