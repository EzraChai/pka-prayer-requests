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

parseBibleVerseCUVS("1John 3:16-18");
