import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export default function SelectExpiresAt({
  value,
  onChange,
  color,
}: {
  value: Date | null;
  onChange: (value: Date | null) => void;
  color: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={` border-2 border-black font-normal 
            ${color === "yellow" && "bg-yellow-200 hover:bg-yellow-300"} 
            ${color === "white" && "bg-white hover:bg-gray-100"} 
            ${color === "cyan" && "bg-cyan-200 hover:bg-cyan-300"} 
            ${color === "red" && "bg-red-200 hover:bg-red-300"}`}
        >
          {value
            ? new Date(value).toLocaleDateString()
            : "Expired At (Optional)"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`p-0 rounded-none border-2 border-black `}>
        <Calendar
          disabled={{
            before: new Date(),
          }}
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => onChange(date ?? null)}
          className="w-full "
        />
      </PopoverContent>
    </Popover>
  );
}
