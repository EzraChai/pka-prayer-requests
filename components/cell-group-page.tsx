"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import PrayerBoard from "./prayer-board";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useEffect, useState, useSyncExternalStore } from "react";

export default function CellGroupPage({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState("");
  const sessionKey = `cell-group-password:${slug}`;
  const sessionPassword = useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(sessionKey) ?? "",
    () => "",
  );
  const activePassword = submittedPassword || sessionPassword;

  const cellGroup = useQuery(api.functions.getCellGroupBySlug, {
    slug,
    password: activePassword || undefined,
  });

  useEffect(() => {
    if (cellGroup && !cellGroup.requiresPassword && activePassword) {
      sessionStorage.setItem(sessionKey, activePassword);
    }
  }, [activePassword, cellGroup, sessionKey]);

  if (cellGroup === undefined) {
    return (
      <div className="mt-32 flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (cellGroup === null) {
    return (
      <main className="mt-32 px-4 text-center">
        <h1 className="text-3xl font-bold">Cell group not found</h1>
        <p className="mt-2">Check the link and try again.</p>
      </main>
    );
  }

  if (cellGroup.requiresPassword) {
    return (
      <main className="mt-32 flex min-h-[60vh] items-start justify-center px-4">
        <form
          className="w-full max-w-md border-3 border-black bg-lime-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          onSubmit={(event) => {
            event.preventDefault();
            if (/^\d{4}$/.test(password)) {
              setSubmittedPassword(password);
            }
          }}
        >
          <h1 className="text-3xl font-black">{cellGroup.name}</h1>
          <p className="mt-2">
            Enter the 4-digit password to access this prayer board.
          </p>
          <InputOTP
            className="mt-6"
            maxLength={4}
            value={password}
            onChange={(value) => setPassword(value.replace(/\D/g, ""))}
            inputMode="numeric"
            aria-label="Cell-group password"
            autoFocus
          >
            <InputOTPGroup className="mx-auto">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-12 w-12 border-black bg-white text-2xl font-bold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {cellGroup.invalidPassword && (
            <p className="mt-2 text-sm font-bold text-red-700">
              Incorrect password. Please try again.
            </p>
          )}
          <Button
            type="submit"
            className="mt-4 w-full border-black bg-neutral-800 text-lg font-bold"
            disabled={password.length !== 4}
          >
            Enter prayer board
          </Button>
        </form>
      </main>
    );
  }

  return (
    <PrayerBoard
      cellGroupId={cellGroup._id}
      cellGroupName={cellGroup.name}
      cellGroupPassword={activePassword}
    />
  );
}
