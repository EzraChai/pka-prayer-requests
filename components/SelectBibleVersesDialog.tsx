import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Select, SelectTrigger } from "./ui/select";

export default function SelectBibleVersesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Select Bible Verses</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Bible Verses</DialogTitle>
        </DialogHeader>
        {/* Content for selecting Bible verses goes here */}
      </DialogContent>
    </Dialog>
  );
}
