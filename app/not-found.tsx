import Link from "next/link";
import { ArrowLeft, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-yellow-50 px-6 pb-16 pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-32 h-56 w-56 rotate-12 border-4 border-black bg-red-500 md:h-72 md:w-72"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 -rotate-12 border-4 border-black bg-yellow-300 md:h-72 md:w-72"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
        <div className="max-w-3xl">
          <div
            aria-hidden="true"
            className="mb-8 flex h-14 w-14 -rotate-6 items-center justify-center border-3 border-black bg-red-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="size-7 text-white" fill="white" strokeWidth={2.5} />
          </div>

          <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.2em]">
            Error 404
          </p>
          <h1 className="max-w-2xl text-6xl font-black leading-[0.88] tracking-[-0.06em] sm:text-8xl md:text-9xl">
            This page wandered off.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-7 text-black/70 sm:text-xl">
            We couldn&apos;t find what you were looking for. Let&apos;s get you
            back to a place where prayers are heard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-12">
              <Link href="/">
                <Home />
                Back to prayer board
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12">
              <Link href="/my-prayers">
                <ArrowLeft />
                My prayers
              </Link>
            </Button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex aspect-square w-full max-w-sm rotate-3 items-center justify-center border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="absolute inset-5 border-3 border-black" />
          <span className="relative text-[clamp(7rem,25vw,13rem)] font-black leading-none tracking-[-0.1em]">
            404
          </span>
          <span className="absolute bottom-7 right-7 -rotate-6 bg-yellow-300 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">
            Lost signal
          </span>
        </div>
      </div>
    </main>
  );
}
