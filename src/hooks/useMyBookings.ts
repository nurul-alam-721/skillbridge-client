import { Booking, bookingService } from "@/services/booking.service";
import { useState, useEffect } from "react";

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const upcoming = bookings.filter((b) =>
    ["PENDING", "CONFIRMED"].includes(b.status)
  );
  const past = bookings.filter((b) =>
    ["COMPLETED", "CANCELLED"].includes(b.status)
  );

  return { bookings, upcoming, past, loading };
}