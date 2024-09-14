"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ClubCard, ClubCardSkeleton } from "~/components/club-card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ?? "Something went wrong"}
          </AlertDescription>
        </Alert>
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
