import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import moment from "moment";
import { LanguageContext } from "./LanguageContextProvider";
import { Fragment, use, useState } from "react";
import { PrayerWithStatus } from "@/convex/myFunctions";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-data";

export default function PrayerCard({ prayer }: { prayer: PrayerWithStatus }) {
  const addPrayerClick = useAction(api.myFunctions.addPrayerClick);
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card
      className={`relative mb-8 w-full h-108 max-w-sm flex justify-between break-inside-avoid ${prayer.color === "yellow" ? "bg-yellow-300" : ""} ${prayer.color === "white" ? "bg-white" : ""} ${prayer.color === "cyan" ? "bg-cyan-300" : ""} ${prayer.color === "red" ? "bg-red-300" : ""} ${prayer.color === "green" ? "bg-lime-300" : ""}`}
    >
      <div className="px-6 text-xs text-neutral-700 flex justify-between">
        <p className="">{prayer.username ? prayer.username : "Anonymous"}</p>
        <div className="bg-white px-2 font-semibold">
          {prayer.prayedCount} AMEN
        </div>
      </div>

      <CardContent
        className="mb-4 text-neutral-800 px-0 flex-1 overflow-y-auto "
        style={{
          scrollbarColor: `black transparent`,
        }}
      >
        <CardHeader className="mt-2 text-2xl font-semibold">
          {prayer.title}
        </CardHeader>
        <p className="px-6">{prayer.content}</p>
        {prayer.bibleVerseCUVS && prayer.bibleVerseESV && (
          <div
            className={`border-black mt-4 border-y-3 p-4 ${prayer.color === "yellow" ? "bg-yellow-200" : ""} ${prayer.color === "white" ? "bg-neutral-100" : ""} ${prayer.color === "cyan" ? "bg-cyan-200" : ""} ${prayer.color === "red" ? "bg-red-200" : ""} ${prayer.color === "green" ? "bg-lime-200" : ""}`}
          >
            <p className="italic font-semibold text-justify whitespace-pre-wrap">
              {typeof window !== "undefined" && lang === "en"
                ? prayer.bibleVerseESV.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      <br />
                    </Fragment>
                  ))
                : prayer.bibleVerseCUVS.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
            </p>
            <p className="mt-2 italic font-semibold">
              {typeof window !== "undefined" && lang === "en"
                ? BIBLE_BOOKS.find(
                    (book) => book.abbr === prayer.bibleVerseRef?.split(" ")[0],
                  )?.engName
                : BIBLE_BOOKS.find(
                    (book) => book.abbr === prayer.bibleVerseRef?.split(" ")[0],
                  )?.chiName}
              {` ${prayer.bibleVerseRef?.split(" ")[1]}`}
            </p>
          </div>
        )}
      </CardContent>

      <CardAction className="px-4 pb-2 flex w-full items-center justify-between">
        <Button
          disabled={prayer.prayed}
          className="relative z-10 w-24 bg-white hover:bg-white text-neutral-800 border-2"
          onClick={async (e) => {
            setIsLoading(true);
            let userId = localStorage.getItem("userId");
            if (!userId) {
              userId = crypto.randomUUID();
              localStorage.setItem("userId", userId);
            }

            spawnPrayParticles(e.clientX, e.clientY);

            await addPrayerClick({
              prayerId: prayer._id,
              userId: userId,
            });
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <Loader2 className=" animate-spin" />
          ) : prayer.prayed ? (
            "✅ Prayed"
          ) : (
            "🙏 Pray"
          )}
        </Button>

        <p className=" text-xs text-neutral-600">
          {moment(prayer.createdAt).fromNow()}
        </p>
      </CardAction>
    </Card>
  );
}

function spawnPrayParticles(x: number, y: number) {
  const icons = ["🙏", "​✝️"];

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("span");

    particle.textContent = icons[Math.floor(Math.random() * icons.length)];

    particle.className = "pray-particle";

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = "translate(-50%, -50%)";

    particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 120}px`);
    particle.style.setProperty("--dy", `${(Math.random() - 0.5) * 120}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 600);
  }
}
