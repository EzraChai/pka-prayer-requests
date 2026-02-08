import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import moment from "moment";
import { LanguageContext } from "./LanguageContextProvider";
import { use, useState } from "react";
import { PrayerWithStatus } from "@/convex/myFunctions";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";

export default function PrayerCard({ prayer }: { prayer: PrayerWithStatus }) {
  const addPrayerClick = useAction(api.myFunctions.addPrayerClick);
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card className="mb-12 w-full max-w-sm break-inside-avoid bg-yellow-300">
      <div className="px-6 text-xs text-neutral-700 flex justify-between">
        <p className="">{prayer.username ? prayer.username : "Anonymous"}</p>
        <div className="bg-white px-2 ">{prayer.prayedCount} AMEN</div>
      </div>
      <CardHeader className="mt-2 text-2xl font-semibold">
        {prayer.title}
      </CardHeader>
      <CardContent className="mb-4 text-neutral-800">
        {prayer.content}
      </CardContent>
      {prayer.bibleVerseCUVS && (
        <div className="border-black border-y-3 p-4 bg-yellow-200">
          <p className="italic font-semibold">
            {lang === "en" ? prayer.bibleVerseESV : prayer.bibleVerseCUVS}
          </p>
          <p className="mt-2 italic font-semibold">
            {lang === "en" ? prayer.bibleVerseESVRef : prayer.bibleVerseCUVSRef}
          </p>
        </div>
      )}
      <CardAction className="px-4 pb-2 flex w-full items-center justify-between">
        <Button
          disabled={prayer.prayed}
          className="relative w-24 bg-white hover:bg-white text-neutral-800 border-2"
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
            "🙏 Prayed"
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
