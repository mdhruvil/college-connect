"use client";

import Image from "next/image";
import { toast } from "sonner";
import { ErrorWithLogin } from "~/components/error-with-login";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getInitials } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export default function ClubPage({ params }: { params: { clubId: string } }) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchClub,
  } = api.club.getClubById.useQuery({
    clubId: params.clubId,
  });
  const joinClub = api.club.joinClub.useMutation();
  const leaveClub = api.club.leaveClub.useMutation();

  if (isLoading) {
    return (
      <div className="container mx-auto h-screen max-w-md space-y-4 !bg-white px-4 py-8">
        <ClubPageSkeleton />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="container mx-auto max-w-md space-y-4 !bg-white px-4 py-8">
        <ErrorWithLogin errorMsg={error?.message ?? "Something went wrong"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen max-w-md space-y-4 !bg-white px-4 py-8">
      <div className="flex flex-col items-center">
        <Image
          src={data.image ?? ""}
          height={100}
          width={100}
          alt={data.name + " Logo"}
          className="aspect-square rounded-2xl object-cover shadow"
        ></Image>
        <h1 className="mt-4 text-center text-2xl font-semibold">{data.name}</h1>
        <div className="mt-3 flex items-center gap-10">
          <div>
            <p className="text-center text-xl font-semibold">
              {data.eventCount}
            </p>
            <p className="text-sm text-muted-foreground">Events</p>
          </div>
          <div>
            <p className="text-center text-xl font-semibold">
              {data.memberCount}
            </p>
            <p className="text-sm text-muted-foreground">Members</p>
          </div>
        </div>
        <div className="mt-4">
          {data.isMember ? (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                leaveClub.mutate(
                  { clubId: params.clubId },
                  {
                    onSuccess: () => {
                      refetchClub().catch(toast.error);
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
              size="lg"
              onClick={() => {
                joinClub.mutate(
                  { clubId: params.clubId },
                  {
                    onSuccess: () => {
                      refetchClub().catch(toast.error);
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
      </div>
      {/* Tabs */}
      <Tabs defaultValue={ClubTabs.About} className="w-full">
        <TabsList className="w-full [&>*]:w-full">
          <TabsTrigger value={ClubTabs.About}>{ClubTabs.About}</TabsTrigger>
          <TabsTrigger value={ClubTabs.Events}>{ClubTabs.Events}</TabsTrigger>
          <TabsTrigger value={ClubTabs.Members}>{ClubTabs.Members}</TabsTrigger>
        </TabsList>
        <TabsContent value={ClubTabs.About}>
          <div>{data.description}</div>
        </TabsContent>
        <TabsContent value={ClubTabs.Events}>
          <div>Events</div>
        </TabsContent>
        <TabsContent value={ClubTabs.Members}>
          <div className="mt-4 space-y-4">
            {data.members.map((member) => {
              return (
                <div className="flex items-center space-x-4" key={member.id}>
                  <Avatar>
                    <AvatarImage src={member.image!} alt="@shadcn" />
                    <AvatarFallback>
                      {getInitials(member.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                      {member.id === data.createdById ? " (Creator)" : ""}
                      {member.id === data.userId ? " (You)" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined on {member.joinedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

enum ClubTabs {
  About = "About",
  Events = "Events",
  Members = "Members",
}

function ClubPageSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Skeleton className="h-[100px] w-[100px] rounded-2xl" />
        <Skeleton className="mt-4 h-8 w-48" />
        <div className="mt-3 flex items-center gap-10">
          <div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="mt-1 h-4 w-12" />
          </div>
          <div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="mt-1 h-4 w-12" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-32" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-4 h-32 w-full" />
      </div>
    </>
  );
}
