"use client";

import { LanguageContext } from "@/components/LanguageContextProvider";
import PrayerCard from "@/components/prayer-card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddNewPrayerForm } from "@/components/add-prayer-form";
import Link from "next/link";

export default function PrayerBoard({
  cellGroupId,
  cellGroupName,
  cellGroupPassword,
}: {
  cellGroupId?: Id<"cell_groups">;
  cellGroupName?: string;
  cellGroupPassword?: string;
}) {
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";
  const [userId, setUserId] = useState(() => {
    if (typeof window === "undefined") return "";
    let user = localStorage.getItem("userId");
    if (!user) {
      user = crypto.randomUUID();
      localStorage.setItem("userId", user);
    }
    return user;
  });

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.functions.getAllPrayers,
    {
      userId,
      ...(cellGroupId ? { cellGroupId } : {}),
      ...(cellGroupPassword ? { cellGroupPassword } : {}),
    },
    { initialNumItems: 12 },
  );

  useEffect(() => {
    const onScroll = () => {
      const distance =
        document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY;

      if (distance < 200 && status === "CanLoadMore") {
        loadMore(8);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadMore, status]);

  return (
    <main className="mt-24 p-4 md:p-12 flex flex-col">
      <section>
        <h1 className="text-4xl font-extrabold">
          {cellGroupName ? `${cellGroupName} Prayer Board` : "PKA Prayer Care"}
        </h1>
        <p className="mt-2">
          {cellGroupName
            ? `Share prayers with the ${cellGroupName} cell group.`
            : "Welcome to the PKA Prayer Care. Share your prayers and support others in their spiritual journey."}
        </p>
      </section>

      <div className="min-h-96 md:min-h-140 w-full">
        {isLoading && status === "LoadingFirstPage" ? (
          <div className="mt-52 flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div>
            {results && results.length > 0 ? (
              <div className="mt-8 columns-1 gap-12 md:columns-2 lg:columns-3 xl:columns-4">
                {results.map((prayer) => (
                  <PrayerCard
                    key={prayer._id}
                    prayer={prayer}
                    setUserId={setUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-52 flex justify-center items-center text-neutral-500">
                Add your prayer now!
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="my-4 flex justify-center">
                <Loader className="animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
      {lang === "en" && (
        <div className="mt-12 text-xs text-neutral-500 text-center mb-24 md:mb-0 md:text-left">
          <p>
            ESV® Bible (The Holy Bible, English Standard Version®), <br />©
            2001 by Crossway, a publishing ministry of Good News Publishers.{" "}
            <br />
            Used by permission. All rights reserved.
          </p>
          <Link href="https://www.esv.org/">
            <Button variant="link" className="p-0 text-xs text-neutral-600">
              https://www.esv.org/
            </Button>
          </Link>
        </div>
      )}

      <div className="fixed bottom-4 md:bottom-16 right-4 md:right-12">
        <AddNewPrayerForm
          cellGroupId={cellGroupId}
          cellGroupName={cellGroupName}
          cellGroupPassword={cellGroupPassword}
        />
      </div>
    </main>
  );
}
