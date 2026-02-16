"use client";

import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function GenerateLinkButton() {
  const generateLink = useAction(api.myFunctions.generateToken);
  const [link, setLink] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={async () => {
            let userId = localStorage.getItem("userId");
            if (!userId) {
              userId = crypto.randomUUID();
              localStorage.setItem("userId", userId);
            }
            const token = await generateLink({ userId });
            if (token) {
              setLink(`${window.location.origin}/link-device?token=${token}`);
              setOpen(true);
            }
          }}
          className="bg-indigo-600 w-full border-3 text-3xl font-black p-8"
        >
          Unique Link
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogTitle>Unique Link</DialogTitle>
        <p>Your unique link has been generated:</p>
        <div className="flex flex-col gap-2">
          <input
            className="border-2 flex-1 px-2 border-black bg-white"
            type="text"
            readOnly
            value={link}
          />
          <Button
            className="mt-1 bg-yellow-300 hover:bg-yellow-300 px-2 border-2 text-black border-black font-semibold"
            onClick={() => {
              if (link && navigator.clipboard) {
                navigator.clipboard.writeText(link);
                toast.success("Link copied to clipboard!");
              }
            }}
          >
            {link ? "Copy Link" : <Loader className="animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
