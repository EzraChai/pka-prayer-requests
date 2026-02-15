"use client";

import LinkDevice from "@/components/LinkDevice";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function LinkDevicePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <LinkDevice searchParams={searchParams} />
    </Suspense>
  );
}
