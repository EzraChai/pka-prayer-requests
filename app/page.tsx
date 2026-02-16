"use client";

import { LanguageContext } from "@/components/LanguageContextProvider";
import PrayerCard from "@/components/prayer-card";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddNewPrayerForm } from "../components/add-prayer-form";
import Link from "next/link";

export default function Home() {
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";

  const [userId] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("userId") ?? "";
  });

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.myFunctions.getAllPrayers,
    {
      userId: userId ?? "",
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
  }, [status]);

  return (
    <main className="mt-24 p-4 md:p-12 flex flex-col ">
      <section>
        <h1 className="text-4xl font-bold">
          PKA <span>Prayer Care</span>
        </h1>
        <p className="mt-2">
          Welcome to the PKA Prayer Care. Share your prayers and support others
          in their spiritual journey.
        </p>
      </section>

      <div className="md:min-h-140 w-full">
        <div className="">
          {isLoading && status === "LoadingFirstPage" ? (
            <div className="mt-52 flex justify-center items-center ">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <div>
              {results && results.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
      </div>
      {typeof window !== "undefined" && lang === "en" && (
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
      <div className="fixed bottom-4 md:bottom-16 right-4 md:right-12">
        <AddNewPrayerForm />
      </div>
    </main>
  );
}
