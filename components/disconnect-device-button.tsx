"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function DisconnectDeviceButton() {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const disconnect = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userId");
      window.location.reload();
    }
  };

  const prayers = useQuery(api.functions.getAllPrayersById, {
    userId: userId ?? "",
  });

  if (prayers && prayers.length > 0) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-2 border-red-600 bg-white text-base font-bold text-red-700 shadow-none hover:bg-red-100 hover:text-red-800"
          >
            Disconnect this device
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect this device?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove access to your prayers from this device. Your
              prayers will remain saved and can be accessed again with your
              unique link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}
