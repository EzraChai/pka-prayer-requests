import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export default function SelectExpiresAt({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (value: Date | null) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className=" font-normal">
          {value
            ? new Date(value).toLocaleDateString()
            : "Expired At (Optional)"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-none  border-2 border-black">
        <Calendar
          disabled={{
            before: new Date(),
          }}
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => onChange(date ?? null)}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
