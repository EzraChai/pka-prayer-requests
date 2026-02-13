import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseBibleVerseCUVS(input: string) {
  if (!input) return null;

  const [book, rest] = input.split(" ");
  const [chapter, versePart] = rest.split(":");

  const [from, to] = versePart.includes("-")
    ? versePart.split("-").map(Number)
    : [Number(versePart), Number(versePart)];

  const verses = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return {
    book,
    chapter: Number(chapter),
    verses,
  };
}

export function formatBibleVerseESV(text: string) {
  // 1️⃣ Find the first [x] marker and slice from it
  const firstVerseIndex = text.search(/\[\d+\]/);
  const sliced = firstVerseIndex !== -1 ? text.slice(firstVerseIndex) : text;

  // 2️⃣ Split lines, trim spaces, remove empty lines
  const lines = sliced
    .split(/\r?\n/)
    .map((line) => line.trim()) // remove leading/trailing spaces
    .filter((line) => line.length > 0); // remove empty lines

  // 3️⃣ Join lines into a single string
  let cleaned = lines.join("\n");

  // 4️⃣ Detect all [x] markers
  const matches = cleaned.match(/\[\d+\]/g) || [];

  // 5️⃣ If only one [x] → remove it
  if (matches.length === 1) {
    cleaned = cleaned.replace(/^\[\d+\]\s*/, "");
    return cleaned;
  }

  // 6️⃣ If multiple → ensure each [x] starts on its own line
  if (matches.length > 1) {
    let first = true;
    cleaned = cleaned.replace(/\[\d+\]/g, (match) => {
      if (first) {
        first = false;
        return match;
      }
      return `\n${match}`;
    });
  }

  return cleaned;
}

type VerseType =
  | "heading"
  | "hebrew_subtitle"
  | "verse"
  | string
  | {
      lineBreak?: boolean;
      poem?: boolean;
      text?: string;
    };

type Verse = {
  content: (string | { lineBreak?: boolean; poem?: boolean; text?: string })[];
  type: VerseType;
  number?: number;
};

function toContent(text: string): Verse["content"] {
  return text
    .split(/\n\n+/)
    .flatMap((chunk, i, arr) => {
      const items: Verse["content"] = [chunk.replace(/\s+/g, " ").trim()];

      if (i !== arr.length - 1) {
        items.push({ lineBreak: true });
      }

      return items;
    })
    .filter((p) =>
      typeof p === "string" ? p.trim() : p.text && p.text.length > 0,
    );
}

export function parseESVBibleText(raw: string): Verse[] {
  console.log(raw);
  const text = raw.trim();

  // split but keep numbers
  const parts = text.split(/\[(\d+)\]/);

  const result: Verse[] = [];

  // parts example:
  // ["Heading text", "1", "verse text", "2", "verse text", ...]

  let i = 0;

  // first chunk may be heading
  if (parts[0].trim()) {
    result.push({
      type: "heading",
      content: toContent(parts[0].trim()),
    });
  }

  for (i = 1; i < parts.length; i += 2) {
    const number = Number(parts[i]);
    const verseText = parts[i + 1]?.trim();

    if (!verseText) continue;

    // BUT verseText may contain another heading before next verse
    // Example: "... complete.\n\nWalking in the Light"

    const splitHeading = verseText.split(/\n\n+(?=[A-Z])/);

    const mainVerse = splitHeading[0];

    result.push({
      type: "verse",
      number,
      content: toContent(mainVerse),
    });

    if (splitHeading[1]) {
      result.push({
        type: "heading",
        content: toContent(splitHeading.slice(1).join("\n\n")),
      });
    }
  }

  return result;
}

// export function parseESVBibleText(raw: string): Verse[] {
//   console.log(raw);
//   const cleaned = raw.trim();

//   const verses: Verse[] = [];

//   // 👉 find first verse number
//   const firstVerseMatch = cleaned.match(/\[\d+\]/);

//   if (!firstVerseMatch) return [];

//   const heading = cleaned.slice(0, firstVerseMatch.index).trim();

//   if (heading) {
//     verses.push({
//       type: "heading",
//       content: [heading],
//     });
//   }

//   // 👉 split by verse markers while keeping numbers
//   const parts = cleaned.split(/\[(\d+)\]/);

//   // parts = ["heading...", "1", " verse text...", "2", " verse text..."]

//   for (let i = 1; i < parts.length; i += 2) {
//     const number = Number(parts[i]);
//     const textBlock = parts[i + 1]?.trim();

//     if (!textBlock) continue;

//     // Split by double line breaks into content blocks
//     const contentPieces = textBlock
//       .split(/\n\n+/)
//       .flatMap((chunk, index, arr) => {
//         const items: Verse["content"] = [chunk.replace(/\s+/g, " ").trim()];

//         if (index !== arr.length - 1) {
//           items.push({ lineBreak: true });
//         }

//         return items;
//       });

//     verses.push({
//       type: "verse",
//       number,
//       content: contentPieces,
//     });
//   }

//   return verses;
// }

parseBibleVerseCUVS("1John 3:16-18");
