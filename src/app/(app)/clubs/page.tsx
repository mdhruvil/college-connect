"use client";
import Fuse from "fuse.js"; // Import fuse.js
import { useMemo, useState } from "react"; // Import useMemo
import { ClubCard, ClubCardSkeleton } from "~/components/club-card";
import { ErrorWithLogin } from "~/components/error-with-login";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    error,
    refetch: refetchClubs,
  } = api.club.getClubs.useQuery();

  // Create a Fuse instance for fuzzy searching
  const fuse = useMemo(() => {
    if (!data) return null;
    return new Fuse(data, {
      keys: ["name"], // Search by club name
      threshold: 0.5, // Adjust threshold for fuzziness (0 = exact match, 1 = match anything)
    });
  }, [data]);

  // Filter clubs based on search query using Fuse.js
  const filteredClubs = useMemo(() => {
    if (!fuse) return [];
    if (!searchQuery) return data ?? []; // Return all data if search query is empty
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, data]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <ClubCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <ErrorWithLogin errorMsg={error?.message ?? "Something went wrong"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
      <Input
        type="text"
        placeholder="Search clubs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      {filteredClubs.map((club) => (
        <ClubCard key={club.id} {...club} refetchClubs={refetchClubs} />
      ))}
    </div>
  );
}
