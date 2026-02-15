import { Card, CardAction, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import moment from "moment";
import { LanguageContext } from "./LanguageContextProvider";
import { Fragment, use } from "react";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { Doc } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { EditPrayerForm } from "./edit-prayer-form";

export default function EditPrayerCard({ prayer }: { prayer: Doc<"prayers"> }) {
  const context = use(LanguageContext);
  const lang = context?.lang ?? "en";
  const deletePrayer = useMutation(api.myFunctions.deletePrayerById);
  return (
    <Card
      className={`mb-12 w-full max-w-sm break-inside-avoid ${prayer.color === "yellow" ? "bg-yellow-300" : ""} ${prayer.color === "white" ? "bg-white" : ""} ${prayer.color === "cyan" ? "bg-cyan-300" : ""} ${prayer.color === "red" ? "bg-red-300" : ""} ${prayer.color === "green" ? "bg-lime-300" : ""}`}
    >
      <div className="px-6 text-xs text-neutral-700 flex justify-between">
        <p className="">{prayer.username ? prayer.username : "Anonymous"}</p>
        <div className="flex gap-2">
          <EditPrayerForm prayer={prayer} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-white hover:bg-red-500 text-black border-3 w-8 h-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your prayer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deletePrayer({
                      prayerId: prayer._id,
                    });
                  }}
                  className="bg-red-500 hover:bg-red-500 text-white font-black border-2"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <CardHeader className="mt-2 text-2xl font-semibold">
        {prayer.title}
      </CardHeader>
      <CardContent className="mb-4 text-neutral-800">
        {prayer.content}
      </CardContent>
      {/* TODO add ESV */}
      {prayer.bibleVerseCUVS && prayer.bibleVerseESV && (
        <div
          className={`border-black border-y-3 p-4 ${prayer.color === "yellow" ? "bg-yellow-200" : ""} ${prayer.color === "white" ? "bg-neutral-100" : ""} ${prayer.color === "cyan" ? "bg-cyan-200" : ""} ${prayer.color === "red" ? "bg-red-200" : ""} ${prayer.color === "green" ? "bg-lime-200" : ""}`}
        >
          <p className="italic font-semibold text-justify whitespace-pre-wrap">
            {lang === "en"
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
            {lang === "en"
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
      <CardAction className="px-4 pb-2 flex w-full items-center justify-between">
        <div className="bg-white px-2 font-semibold">
          {prayer.prayedCount} Prayed
        </div>
        <p className=" text-xs text-neutral-600">
          {moment(prayer.createdAt).fromNow()}
        </p>
      </CardAction>
    </Card>
  );
}
