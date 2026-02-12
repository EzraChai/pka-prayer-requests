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
  // 1. Trim + remove ending newlines
  const cleaned = text.trim().replace(/\n+$/, "");

  // 2. Find all [
  const matches = cleaned.match(/\[/g) || [];

  // 3. If only one [, remove [number]
  if (matches.length === 1) {
    return cleaned.replace(/\[\d+\]\s*/, "");
  }

  // 4. If more than one [, add <br/> before 2nd onwards
  let count = 0;
  return cleaned.replace(/\[\d+\]/g, (match) => {
    count++;
    return count === 1 ? match : `\n${match}`;
  });
}

parseBibleVerseCUVS("1John 3:16-18");
