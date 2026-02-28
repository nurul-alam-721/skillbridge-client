import { format } from "date-fns";
import { CalendarDays, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "@/services/booking.service";

const STATUS_MAP: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING:   { label: "Pending",   variant: "outline"     },
  CONFIRMED: { label: "Confirmed", variant: "default"     },
  COMPLETED: { label: "Completed", variant: "secondary"   },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function BookingCard({ booking }: { booking: Booking }) {
  const { label, variant } = STATUS_MAP[booking.status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">
              {booking.tutorProfile.user?.name ?? "Tutor"}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {booking.tutorProfile.category?.name ?? ""}
            </CardDescription>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>
            {format(new Date(booking.slot.date), "EEEE, MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {format(new Date(booking.slot.startTime), "h:mm a")}
            {" – "}
            {format(new Date(booking.slot.endTime), "h:mm a")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>${booking.tutorProfile.hourlyRate} / hr</span>
        </div>
      </CardContent>
    </Card>
  );
}