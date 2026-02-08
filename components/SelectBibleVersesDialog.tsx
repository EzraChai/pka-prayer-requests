import { use, useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContextProvider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "./ui/dialog";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";

const fetchBibleChapter = async (
  bookAbbr: string,
  chapter: number,
  lang: string,
) => {
  if (lang === "en") {
  } else {
    const res = await fetch(
      `https://bible.helloao.org/api/cmn_cu1/${bookAbbr}/${chapter}.json`,
    );
    return res.json();
  }
};

export default function SelectBibleVersesDialog({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const context = use(LanguageContext);
  const lang = context?.lang || "en";
  const [testaments, setTestaments] = useState<"All" | "NT" | "OT">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookAbbr, setBookAbbr] = useState<string | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<
    { content: string[]; type: string; number?: number }[]
  >([]);
  const [selectedVersesFrom, setSelectedVersesFrom] = useState<number | null>(
    null,
  );
  const [selectedVersesTo, setSelectedVersesTo] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chapter && bookAbbr) {
      fetchBibleChapter(bookAbbr, chapter, lang).then((data) => {
        setVerses(data.chapter.content);
      });
    }
  }, [chapter]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Select Bible Verse (Optional)</Button>
      </DialogTrigger>
      <DialogContent className="w-2xl">
        <DialogHeader>
          <DialogTitle>Select Bible Verse</DialogTitle>
        </DialogHeader>
        {bookAbbr && chapter && (
          <>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => {
                  setChapter(null);
                  setVerses([]);
                  setSelectedVersesFrom(null);
                  setSelectedVersesTo(null);
                  onChange("");
                }}
                variant="ghost"
                size="icon"
                className="p-0 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="flex items-center gap-1">
                <h3>
                  {lang === "en"
                    ? BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.engName
                    : BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.chiName}
                </h3>
                <ChevronRight size={12} />
                <h3>
                  {lang === "en" ? " Chapter " + chapter : chapter + "章"}
                </h3>
              </div>
            </div>
            <div className="h-96 overflow-scroll ">
              {verses.length ? (
                verses.map((verseObj, index) => {
                  if (verseObj.type === "heading") {
                    return (
                      <h3 key={index} className="mt-4 font-bold my-2">
                        {verseObj.content.map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {typeof line === "string" && line}
                            <br />
                          </span>
                        ))}
                      </h3>
                    );
                  }
                  if (verseObj.type === "verse") {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (verseObj.number === undefined) return;
                          if (selectedVersesFrom === null) {
                            setSelectedVersesFrom(verseObj.number);
                          } else if (
                            selectedVersesFrom !== null &&
                            selectedVersesTo !== null &&
                            selectedVersesFrom > verseObj.number
                          ) {
                            setSelectedVersesFrom(verseObj.number);
                          } else if (
                            selectedVersesFrom !== null &&
                            selectedVersesTo === null &&
                            selectedVersesFrom > verseObj.number
                          ) {
                            setSelectedVersesTo(selectedVersesFrom);
                            setSelectedVersesFrom(verseObj.number);
                          } else if (
                            selectedVersesFrom !== null &&
                            selectedVersesTo !== null &&
                            selectedVersesTo < verseObj.number
                          ) {
                            setSelectedVersesTo(verseObj.number);
                          } else if (
                            selectedVersesFrom !== null &&
                            selectedVersesTo !== null &&
                            selectedVersesFrom < verseObj.number &&
                            selectedVersesTo > verseObj.number
                          ) {
                            setSelectedVersesFrom(verseObj.number);
                          } else if (
                            selectedVersesFrom !== null &&
                            selectedVersesTo === null &&
                            selectedVersesFrom !== verseObj.number &&
                            selectedVersesFrom < verseObj.number
                          ) {
                            setSelectedVersesTo(verseObj.number);
                          } else if (selectedVersesFrom === verseObj.number) {
                            if (selectedVersesTo !== null) {
                              setSelectedVersesFrom(selectedVersesTo);
                              setSelectedVersesTo(null);
                            } else {
                              setSelectedVersesFrom(null);
                            }
                          } else if (selectedVersesTo === verseObj.number) {
                            setSelectedVersesTo(null);
                          }
                        }}
                        className={`w-full py-3 text-left flex gap-2 hover:bg-neutral-200 px-2 ${
                          selectedVersesFrom === verseObj.number ||
                          selectedVersesTo === verseObj.number ||
                          (verseObj.number &&
                            selectedVersesFrom &&
                            selectedVersesFrom < verseObj.number &&
                            selectedVersesTo &&
                            verseObj.number < selectedVersesTo)
                            ? "bg-yellow-300 hover:bg-yellow-200"
                            : ""
                        }`}
                      >
                        <p className="w-6">{verseObj.number}</p>
                        <p className="text-left w-full">
                          {verseObj.content.map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {typeof line === "string" && line}
                            </span>
                          ))}
                        </p>
                      </button>
                    );
                  }
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  <LoaderCircle className="animate-spin " />
                </div>
              )}
            </div>
          </>
        )}
        {bookAbbr && !chapter && (
          <>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => {
                  setChapter(null);
                  setVerses([]);
                  setBookAbbr(null);
                  onChange("");
                }}
                variant="ghost"
                size="icon"
                className="p-0 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </Button>
              <h3>
                {lang === "en"
                  ? BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.engName
                  : BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.chiName}
              </h3>
            </div>
            <div className="text-xs select-none">
              {lang !== "en" && "共有"}{" "}
              {BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.totalChapters}{" "}
              {lang === "en" ? "Chapters available." : "章"}
            </div>
            <div className="grid grid-cols-10 gap-2">
              {Array.from(
                {
                  length:
                    BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)
                      ?.totalChapters || 0,
                },
                (_, i) => i + 1,
              ).map((chapter) => (
                <Button
                  className="p-0 flex justify-center border hover:bg-yellow-300 items-center px-2 py-1 cursor-pointer"
                  key={chapter}
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setChapter(chapter);
                  }}
                >
                  <h3 className="font-bold">{chapter}</h3>
                </Button>
              ))}
            </div>
          </>
        )}
        {!chapter && !bookAbbr && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setTestaments("All")}
                className={` ${testaments === "All" && "bg-yellow-300 "} border border-black text-xs transition-all py-1 px-2`}
              >
                {lang === "en" ? "All" : "全部"}
              </button>
              <button
                onClick={() => setTestaments("OT")}
                className={` ${testaments === "OT" && "bg-yellow-300 "} border border-black text-xs transition-all py-1 px-2`}
              >
                {lang === "en" ? "Old Testament" : "旧约"}
              </button>
              <button
                onClick={() => setTestaments("NT")}
                className={` ${testaments === "NT" && "bg-yellow-300 "} border border-black text-xs transition-all py-1 px-2`}
              >
                {lang === "en" ? "New Testament" : "新约"}
              </button>
            </div>
            <div className="relative">
              <input
                value={searchTerm}
                placeholder="Search Book"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 ring-0 border-b-2 border-neutral-400 focus:border-black focus:ring-0 outline-0 w-full my-4"
                type="text"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black transition"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="h-96 overflow-scroll">
              <div className="grid grid-cols-2 ">
                {BIBLE_BOOKS.filter((book) => {
                  if (testaments === "All") return true;
                  if (testaments === "NT") return book.testament === "NT";
                  if (testaments === "OT") return book.testament === "OT";
                  return true;
                })
                  .filter((book) => {
                    if (!searchTerm) return true;
                    return (
                      book.engName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      book.chiName.includes(searchTerm)
                    );
                  })
                  .map((book) => (
                    <div
                      key={book.abbr}
                      className="hover:bg-yellow-300 mb-2 flex items-center px-2 py-1 cursor-pointer"
                      onClick={() => setBookAbbr(book.abbr)}
                    >
                      <h3 className="font-bold">
                        {lang === "en" ? book.engName : book.chiName}
                      </h3>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
        {chapter && bookAbbr && (
          <DialogFooter>
            <Button
              variant={"secondary"}
              onClick={() => {
                setSelectedVersesFrom(null);
                setSelectedVersesTo(null);
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                onChange(
                  `${bookAbbr} ${chapter}:${selectedVersesFrom}${selectedVersesTo ? `-${selectedVersesTo}` : ""}`,
                );
                setOpen(false);
              }}
              disabled={selectedVersesFrom === null}
              className="bg-yellow-300 hover:bg-yellow-300 text-neutral-900 border-2"
            >
              {lang === "en"
                ? BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.engName
                : BIBLE_BOOKS.find((b) => b.abbr === bookAbbr)?.chiName}
              {chapter ? ` ${chapter}` : ""}
              {selectedVersesFrom
                ? `:${selectedVersesFrom}${
                    selectedVersesTo ? `-${selectedVersesTo}` : ""
                  }`
                : ""}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
