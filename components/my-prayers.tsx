"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerEditCard from "./edit-prayer-card";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

type MyPrayer = Doc<"prayers"> & {
  cellGroup: Doc<"cell_groups"> | null;
};

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

  const prayers = useQuery(api.functions.getAllPrayersById, {
    userId: userId ?? "",
  });

  if (typeof prayers == "undefined") {
    return (
      <div className="text-center mt-24 flex justify-center items-center ">
        <Loader className="animate-spin" />
      </div>
    );
  } else {
    const mainPrayers = prayers.filter((prayer) => !prayer.cellGroup);
    const cellGroupPrayers = prayers.filter(
      (prayer): prayer is MyPrayer => prayer.cellGroup !== null,
    );

    return prayers.length > 0 ? (
      <div className="mt-4 md:mt-8 space-y-12">
        {mainPrayers.length > 0 && (
          <section>
            <h3 className="text-xl font-bold">Main prayer board</h3>
            <div className="min-h-32 mt-4 columns-1 gap-12 md:columns-2 lg:columns-3 xl:columns-4 py-4">
              {mainPrayers.map((prayer) => (
                <PrayerEditCard prayer={prayer} key={prayer._id} />
              ))}
            </div>
          </section>
        )}
        {cellGroupPrayers.length > 0 && (
          <section>
            <h3 className="text-xl font-bold">Cell-group prayer boards</h3>
            <p className="mt-1 text-sm text-neutral-600">
              These prayers were written on a cell-group board, not the main
              prayer board.
            </p>
            <div className="min-h-32 mt-4 columns-1 gap-12 md:columns-2 lg:columns-3 xl:columns-4 py-4">
              {cellGroupPrayers.map((prayer) => (
                <PrayerEditCard prayer={prayer} key={prayer._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    ) : (
      <div className="mt-12 md:mt-24 text-center py-4 text-neutral-500">
        No prayers found. Add your prayer now!
      </div>
    );
  }
}
