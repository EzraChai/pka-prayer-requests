"use client";
import { use, useRef, UIEvent } from "react";
import { LanguageContext } from "./LanguageContextProvider";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PrayerCard from "./prayer-card";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function PrayerList() {
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.myFunctions.getAllPrayers,
    {
      userId:
        typeof window !== "undefined"
          ? (localStorage.getItem("userId") ?? "")
          : "",
    },
    { initialNumItems: 9 },
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 400; // px from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom < threshold && status === "CanLoadMore") {
      loadMore(9);
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="overflow-y-auto h-full"
      >
        {isLoading && status === "LoadingFirstPage" ? (
          <div className="mt-52 flex justify-center items-center ">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div>
            {results && results.length > 0 ? (
              <div className="mt-8 columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-12">
                {results.map((prayer) => (
                  <PrayerCard key={prayer._id} prayer={prayer} />
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
    </>
  );
}
