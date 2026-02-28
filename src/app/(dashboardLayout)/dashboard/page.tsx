"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { userService, CurrentUser } from "@/services/user.service";
import { useMyBookings } from "@/hooks/useMyBookings";
import { SectionCards } from "@/components/layout/SectionCards";
import { ProfileEditForm } from "@/components/modules/user/profileEditForm";
import { BookingsTable } from "@/components/modules/bookings/bookingsTable";

export default function StudentDashboardPage() {
  const { bookings, loading } = useMyBookings();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    userService.getMe().then(setUser).catch(() => null);
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards bookings={loading ? [] : bookings} />

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">
              Bookings
              {bookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {bookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsTable bookings={loading ? [] : bookings} />
          </TabsContent>

          <TabsContent value="profile" className="max-w-lg">
            {user && <ProfileEditForm user={user} onUpdated={setUser} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}