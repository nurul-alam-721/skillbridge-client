import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AvailabilitySlot } from "@/services/tutor.service";

interface AvailabilitySlotsProps {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSelect: (slot: AvailabilitySlot) => void;
}

function groupByDate(slots: AvailabilitySlot[]) {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const day = format(new Date(slot.date), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});
}

export function AvailabilitySlots({
  slots,
  selectedSlotId,
  onSelect,
}: AvailabilitySlotsProps) {
  const available = slots.filter((s) => !s.isBooked);

  if (available.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No available slots at the moment.
      </p>
    );
  }

  const grouped = groupByDate(available);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([day, daySlots]) => (
        <div key={day}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">
              {format(new Date(day), "EEEE, MMM d")}
            </p>
          </div>

          <ToggleGroup
            type="single"
            value={selectedSlotId ?? ""}
            onValueChange={(val: string | number | null) => {
              const slot = daySlots.find((s) => s.id === val);
              if (slot) onSelect(slot);
            }}
            className="flex flex-wrap gap-2 justify-start"
          >
            {daySlots.map((slot) => (
              <ToggleGroupItem
                key={slot.id}
                value={slot.id}
                className="flex flex-col h-auto px-4 py-3 gap-1 rounded-xl border data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Clock className="h-3.5 w-3.5 opacity-70" />
                <span className="text-xs font-medium">
                  {format(new Date(slot.startTime), "h:mm a")}
                </span>
                <span className="text-xs opacity-70">
                  {format(new Date(slot.endTime), "h:mm a")}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
    </div>
  );
}