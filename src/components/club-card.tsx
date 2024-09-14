import Image from "next/image";
import { api, type RouterOutputs } from "~/trpc/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

type ClubCardProps = RouterOutputs["club"]["getClubs"][number] & {
  refetchClubs: () => Promise<unknown>;
};

export function ClubCard({
  name,
  description,
  image,
  memberCount,
  eventCount,
  isMember,
  id: clubId,
  refetchClubs,
}: ClubCardProps) {
  const joinClub = api.club.joinClub.useMutation();
  const leaveClub = api.club.leaveClub.useMutation();
  return (
    <Card className="p-4">
      <Link href={`/clubs/${clubId}`}>
        <div className="flex gap-8">
          <Image
            height={80}
            width={80}
            src={image ?? ""}
            alt={name + " Logo"}
            className="aspect-square rounded-lg object-cover shadow"
          />
          <div className="flex items-center gap-10">
            <div>
              <p className="text-center text-xl font-semibold">{eventCount}</p>
              <p className="text-sm text-muted-foreground">Events</p>
            </div>
            <div>
              <p className="text-center text-xl font-semibold">{memberCount}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xl font-semibold">{name}</div>
        <div className="line-clamp-2 text-muted-foreground">{description}</div>
      </Link>
      <div className="mt-4">
        {isMember ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              leaveClub.mutate(
                { clubId },
                {
                  onSuccess: () => {
                    refetchClubs().catch(toast.error);
                  },
                  onError(error) {
                    toast.error(error.message, { richColors: true });
                  },
                },
              );
            }}
            loading={leaveClub.isPending}
          >
            Leave Club
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              joinClub.mutate(
                { clubId },
                {
                  onSuccess: () => {
                    refetchClubs().catch(toast.error);
                  },
                  onError(error) {
                    toast.error(error.message);
                  },
                },
              );
            }}
            loading={joinClub.isPending}
          >
            Join Club
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ClubCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-8">
        <Skeleton className="size-[80px]" />
        <div className="flex items-center gap-10">
          <div>
            <Skeleton className="mx-auto h-4 w-4" />
            <Skeleton className="mt-2 h-4 w-16" />
          </div>
          <div>
            <Skeleton className="mx-auto h-4 w-4" />
            <Skeleton className="mt-2 h-4 w-16" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-4 h-6 w-48" />
      <Skeleton className="mt-2 line-clamp-2 h-4 w-64" />
      <Skeleton className="mt-4 h-8 w-full" />
    </Card>
  );
}
