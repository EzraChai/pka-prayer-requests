"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import PrayerBoard from "./prayer-board";
import { KeyRound, Loader, ShieldAlert } from "lucide-react";
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
      <main className="relative mt-24 flex min-h-[calc(100vh-6rem)] items-start justify-center overflow-hidden bg-yellow-50 px-4 py-12 md:items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-20 h-48 w-48 rotate-12 border-3 border-black bg-red-500 md:h-64 md:w-64"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 -rotate-12 border-3 border-black bg-yellow-300"
        />
        <form
          className="relative w-full max-w-lg border-3 border-black bg-lime-300 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:p-9"
          onSubmit={(event) => {
            event.preventDefault();
            if (/^\d{4}$/.test(password)) {
              setSubmittedPassword(password);
            }
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                Private prayer board
              </p>
              <h1 className="mt-2 text-3xl font-black leading-none sm:text-4xl">
                {cellGroup.name}
              </h1>
            </div>
            <div
              aria-hidden="true"
              className="flex size-14 shrink-0 -rotate-6 items-center justify-center border-3 border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <KeyRound className="size-7" strokeWidth={2.5} />
            </div>
          </div>

          <p className="mt-8 max-w-md text-base leading-6 text-black/75">
            Enter the four-digit access code shared with your cell group.
          </p>

          <label
            htmlFor="cell-group-password"
            className="mt-6 block text-sm font-bold uppercase tracking-wide"
          >
            Access code
          </label>
          <InputOTP
            id="cell-group-password"
            className="mt-3"
            maxLength={4}
            value={password}
            onChange={(value) => setPassword(value.replace(/\D/g, ""))}
            inputMode="numeric"
            aria-label="Cell-group password"
            aria-invalid={cellGroup.invalidPassword}
            autoFocus
          >
            <InputOTPGroup className="mx-0">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-14 border-black bg-white text-2xl font-bold sm:size-16"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {cellGroup.invalidPassword && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 border-3 border-black bg-red-100 p-3 text-sm font-bold text-red-900"
            >
              <ShieldAlert className="mt-0.5 size-5 shrink-0" />
              <p>
                That code didn&apos;t work. Check the digits and try again.
              </p>
            </div>
          )}
          <Button
            type="submit"
            className="mt-6 h-12 w-full border-black bg-neutral-800 text-base font-bold sm:text-lg"
            disabled={password.length !== 4}
          >
            Unlock prayer board
          </Button>
          <p className="mt-4 text-center text-xs font-medium text-black/60">
            Need the code? Ask someone in your cell group.
          </p>
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
