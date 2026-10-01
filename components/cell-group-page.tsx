"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import PrayerBoard from "./prayer-board";
import { Loader } from "lucide-react";

export default function CellGroupPage({ slug }: { slug: string }) {
  const cellGroup = useQuery(api.functions.getCellGroupBySlug, { slug });

  if (cellGroup === undefined) {
    return (
      <div className="mt-32 flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (cellGroup === null) {
    return (
      <main className="mt-32 px-4 text-center">
        <h1 className="text-3xl font-bold">Cell group not found</h1>
        <p className="mt-2">Check the link and try again.</p>
      </main>
    );
  }

  return (
    <PrayerBoard cellGroupId={cellGroup._id} cellGroupName={cellGroup.name} />
  );
}
