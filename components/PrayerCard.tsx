import { Id } from "@/convex/_generated/dataModel";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

export default function PrayerCard({
  prayer,
}: {
  prayer: {
    _id: Id<"prayers">;
    _creationTime: number;
    bibleVerseESV?: string | undefined;
    bibleVerseCUVS?: string | undefined;
    expiresAt?: number | undefined;
    createdAt: number;
    content: string;
    title: string;
    prayedCount: number;
    bibleVerseCUVSRef?: string | undefined;
    bibleVerseESVRef?: string | undefined;
    createdBy: Id<"users">;
  };
}) {
  return (
    <Card className="mb-6 w-full max-w-sm break-inside-avoid bg-yellow-300">
      <CardHeader className="text-2xl font-semibold">{prayer.title}</CardHeader>
      <CardContent className="mb-4">{prayer.content}</CardContent>
      <div className="border-black border-y-3 p-4 bg-yellow-200">
        <p className="italic font-semibold">{prayer.bibleVerseCUVS}</p>
        <p className="mt-2 italic font-semibold">{prayer.bibleVerseCUVSRef}</p>
      </div>
      <CardAction className="p-4 flex w-full items-center justify-between">
        <Button
          className="relative bg-white hover:bg-white text-neutral-800 border-2"
          onClick={(e) => {
            spawnPrayParticles(e.clientX, e.clientY);
          }}
        >
          🙏 Pray
        </Button>
        <p className="italic">
          Prayed {prayer.prayedCount} time
          {prayer.prayedCount === 1 ? "" : "s"}
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
