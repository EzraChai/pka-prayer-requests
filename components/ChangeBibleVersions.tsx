"use client";

import { use } from "react";
import { LanguageContext } from "./LanguageContextProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ChangeBibleVersions() {
  const { lang, setLang } = use(LanguageContext)!;
  return (
    <Select value={lang} onValueChange={(value) => setLang(value)}>
      <SelectTrigger
        size="sm"
        className=" w-36 bg-white border-black border-3 rounded-none"
      >
        <SelectValue defaultValue={"en"} placeholder="Versions" />
      </SelectTrigger>
      <SelectContent
        align="center"
        position="popper"
        className="rounded-none border-black border-3 bg-white"
      >
        <SelectGroup>
          <SelectLabel> Bible Versions </SelectLabel>
          <SelectItem value="en">English (ESV)</SelectItem>
          <SelectItem value="cn">中文 (CUVS)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
