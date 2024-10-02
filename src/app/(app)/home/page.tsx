"use client";

import { ErrorWithLogin } from "~/components/error-with-login";
import { EventCard, EventCardSkeleton } from "~/components/event-card";
import { api } from "~/trpc/react";

export default function Home() {
  const { data: events, isLoading, error } = api.event.getEvents.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 w-11/12 space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error || !events) {
    console.log({ error });
    return (
      <div className="mx-auto mt-8 w-11/12 space-y-4">
        <ErrorWithLogin
          errorMsg={
            error?.message ?? "Failed to load events. Please try again later."
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-11/12 space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          name={event.name}
          description={event.description ?? ""}
          image={event.image ?? ""}
          date={event.eventDate}
          location={event.location ?? ""}
          clubName={event.club.name}
          registrationCount={event.eventRegistrations.length}
          id={event.id}
        />
      ))}
    </div>
  );
}
