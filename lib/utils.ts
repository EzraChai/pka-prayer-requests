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

  const bookMap: Map<string, string> = new Map([
    ["Genesis", "GEN"],
    ["Exodus", "EXO"],
    ["Leviticus", "LEV"],
    ["Numbers", "NUM"],
    ["Deuteronomy", "DEU"],
    ["Joshua", "JOS"],
    ["Judges", "JDG"],
    ["Ruth", "RUT"],
    ["1Samuel", "1SA"],
    ["2Samuel", "2SA"],
    ["1Kings", "1KI"],
    ["2Kings", "2KI"],
    ["1Chronicles", "1CH"],
    ["2Chronicles", "2CH"],
    ["Ezra", "EZR"],
    ["Nehemiah", "NEH"],
    ["Esther", "EST"],
    ["Job", "JOB"],
    ["Psalms", "PSA"],
    ["Proverbs", "PRO"],
    ["Ecclesiastes", "ECC"],
    ["Song of Solomon", "SNG"],
    ["Isaiah", "ISA"],
    ["Jeremiah", "JER"],
    ["Lamentations", "LAM"],
    ["Ezekiel", "EZK"],
    ["Daniel", "DAN"],
    ["Hosea", "HOS"],
    ["Joel", "JOE"],
    ["Amos", "AMO"],
    ["Obadiah", "OBA"],
    ["Jonah", "JON"],
    ["Micah", "MIC"],
    ["Nahum", "NAH"],
    ["Habakkuk", "HAB"],
    ["Zephaniah", "ZEP"],
    ["Haggai", "HAG"],
    ["Zechariah", "ZEC"],
    ["Malachi", "MAL"],
    ["Matthew", "MAT"],
    ["Mark", "MRK"],
    ["Luke", "LUK"],
    ["John", "JHN"],
    ["Acts", "ACT"],
    ["Romans", "ROM"],
    ["1Corinthians", "1CO"],
    ["2Corinthians", "2CO"],
    ["Galatians", "GAL"],
    ["Ephesians", "EPH"],
    ["Philippians", "PHP"],
    ["Colossians", "COL"],
    ["1Thessalonians", "1TH"],
    ["2Thessalonians", "2TH"],
    ["1Timothy", "1TI"],
    ["2Timothy", "2TI"],
    ["Titus", "TIT"],
    ["Philemon", "PHM"],
    ["Hebrews", "HEB"],
    ["James", "JAS"],
    ["1Peter", "1PE"],
    ["2Peter", "2PE"],
    ["1John", "1JN"],
    ["2John", "2JN"],
    ["3John", "3JN"],
    ["Jude", "JUD"],
    ["Revelation", "REV"],
  ]);

  const shortBook = bookMap.get(book);

  return {
    shortBook,
    chapter: Number(chapter),
    verses,
  };
}

parseBibleVerseCUVS("1John 3:16-18");
