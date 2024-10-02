"use client";
import { ClubCard, ClubCardSkeleton } from "~/components/club-card";
import { ErrorWithLogin } from "~/components/error-with-login";
import { api } from "~/trpc/react";

export default function Clubs() {
  const {
    data,
    isLoading,
    error,
    refetch: refetchClubs,
  } = api.club.getClubs.useQuery();

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
      {data.map((club) => (
        <ClubCard key={club.id} {...club} refetchClubs={refetchClubs} />
      ))}
    </div>
  );
}
