"use client";

import { LanguageContext } from "@/components/LanguageContextProvider";
import PrayerCard from "@/components/prayer-card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { BookHeart, Loader } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-yellow-50 px-4 pb-32 pt-32 sm:px-6 sm:pt-36 md:px-12 md:pb-40 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-44 h-48 w-48 rotate-12 border-3 border-black bg-yellow-300 sm:h-56 sm:w-56 md:-right-24 md:top-36 md:h-64 md:w-64"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 -rotate-12 border-3 border-black bg-red-500 md:-bottom-32 md:h-72 md:w-72"
      />

      <section className="relative mx-auto w-full max-w-7xl">
        <div className="flex max-w-3xl items-start gap-3 sm:gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
              {cellGroupName ? "Private circle" : "A place to pray"}
            </p>
            <h1 className="mt-2 break-words text-4xl font-black leading-[0.92] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              {cellGroupName
                ? `${cellGroupName} Prayer Board`
                : "PKA Prayer Care"}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-base leading-7 text-black/70 sm:mt-6 sm:text-lg">
          {cellGroupName
            ? `Share prayers with the ${cellGroupName} cell group.`
            : "Share your prayers and support others in their spiritual journey."}
        </p>
      </section>

      <div className="relative mx-auto min-h-96 w-full max-w-7xl md:min-h-140">
        {isLoading && status === "LoadingFirstPage" ? (
          <div className="mt-32 flex flex-col items-center justify-center gap-3 text-center md:mt-44">
            <Loader className="size-8 animate-spin" />
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
              Gathering prayers
            </p>
          </div>
        ) : (
          <div>
            {results && results.length > 0 ? (
              <div className="mt-8 columns-1 gap-5 sm:mt-10 sm:columns-2 sm:gap-6 lg:columns-3 xl:columns-4">
                {results.map((prayer) => (
                  <PrayerCard
                    key={prayer._id}
                    prayer={prayer}
                    setUserId={setUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-28 max-w-md border-3 border-black bg-white p-8 text-center shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] md:mt-36">
                <p className="text-2xl font-black">The board is quiet.</p>
                <p className="mt-3 leading-6 text-black/65">
                  Be the first to share a prayer.
                </p>
              </div>
            )}
            {status === "LoadingMore" && (
              <div className="my-8 flex justify-center">
                <Loader className="animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
      {lang === "en" && (
        <div className="relative mx-auto mt-16 w-full max-w-7xl text-center text-xs text-neutral-500 md:text-left">
          <p>
            ESV® Bible (The Holy Bible, English Standard Version®), <br />© 2001
            by Crossway, a publishing ministry of Good News Publishers. <br />
            Used by permission. All rights reserved.
          </p>
          <Link href="https://www.esv.org/">
            <Button variant="link" className="p-0 text-xs text-neutral-600">
              https://www.esv.org/
            </Button>
          </Link>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-20 md:bottom-10 md:right-10">
        <AddNewPrayerForm
          cellGroupId={cellGroupId}
          cellGroupName={cellGroupName}
          cellGroupPassword={cellGroupPassword}
        />
      </div>
    </main>
  );
}
