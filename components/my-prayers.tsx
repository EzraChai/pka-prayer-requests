"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerEditCard from "./edit-prayer-card";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function MyPrayers() {
  const [userId] = useState(() => {
    if (typeof window === "undefined") return "";
    let user = localStorage.getItem("userId");
    if (!user) {
      user = crypto.randomUUID();
      localStorage.setItem("userId", user);
    }
    return user;
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
      <div className=" min-h-90 mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 py-4">
        {prayers.map((prayer) => (
          <PrayerEditCard prayer={prayer} key={prayer._id} />
        ))}
      </div>
    ) : (
      <div className="mt-12 md:mt-24 text-center py-4 text-neutral-500">
        No prayers found. Add your prayer now!
      </div>
    );
  }
}
