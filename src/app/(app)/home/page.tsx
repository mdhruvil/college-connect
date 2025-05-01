"use client";

import Fuse from "fuse.js"; // Import fuse.js
import { useMemo, useState } from "react"; // Import useMemo
import { ErrorWithLogin } from "~/components/error-with-login";
import { EventCard, EventCardSkeleton } from "~/components/event-card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: events, isLoading, error } = api.event.getEvents.useQuery();

  // Create a Fuse instance for fuzzy searching events
  const fuse = useMemo(() => {
    if (!events) return null;
    return new Fuse(events, {
      keys: ["name"], // Search by event name
      threshold: 0.5, // Adjust threshold for fuzziness
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!fuse) return [];
    if (!searchQuery) return events ?? []; // Return all data if search query is empty
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, events]);

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

  // Filter events based on search query using Fuse.js

  return (
    <div className="mx-auto mt-8 w-11/12 space-y-4">
      <Input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {filteredEvents.map((event) => (
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
