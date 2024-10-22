"use client";

import { formatDate } from "date-fns";
import {
  CalendarClockIcon,
  MapPinIcon,
  Share2Icon,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ErrorWithLogin } from "~/components/error-with-login";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getInitials, getYearOfStudy } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";

type EventPageProps = {
  params: {
    eventId: string;
  };
};

export default function EventPage({ params }: EventPageProps) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchEvent,
  } = api.event.getEventById.useQuery({
    eventId: params.eventId,
  });

  const registerForEvent = api.event.registerForEvent.useMutation({
    onSettled: async () => {
      return await refetchEvent();
    },
  });
  const unregisterForEvent = api.event.unregisterForEvent.useMutation({
    onSettled: async () => {
      return await refetchEvent();
    },
  });

  if (isLoading) return <EventSkeleton />;

  if (error || !data) {
    return (
      <ErrorWithLogin errorMsg={error?.message ?? "Something went wrong"} />
    );
  }

  async function shareEvent(
    eventName: string,
    eventDescription: string,
    eventUrl: string,
  ) {
    await navigator
      .share({
        title: eventName,
        text: eventDescription,
        url: eventUrl,
      })
      .catch((error) => {
        console.error("Error sharing event:", error);
        toast.error("Error sharing event");
      });
  }

  return (
    <div className="h-screen !bg-white">
      <Image
        src={data.image ?? ""}
        height={300}
        width={400}
        alt={data.name + " Logo"}
        className="h-[270px] w-screen object-cover shadow"
      />
      <div className="container mx-auto mt-4 max-w-md space-y-4 !bg-white px-4">
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          {data.isCreator && (
            <p className="text-sm">Event Code: {data.shortCode}</p>
          )}
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
        <div className="flex items-center gap-1">
          {!data.isRegistered ? (
            <Button
              className="w-full py-5"
              onClick={() => {
                registerForEvent.mutate({
                  eventId: data.id,
                });
              }}
              loading={registerForEvent.isPending}
            >
              Register
            </Button>
          ) : (
            <Button
              className="w-full py-5"
              onClick={() => {
                unregisterForEvent.mutate({
                  eventId: data.id,
                });
              }}
              loading={unregisterForEvent.isPending}
              variant="outline"
            >
              Registered
            </Button>
          )}
          <Button
            className="w-full py-5"
            variant="secondary"
            onClick={() =>
              shareEvent(
                data.name,
                data.description ?? "",
                `${window.location.origin}/events/${data.id}`,
              )
            }
          >
            <Share2Icon className="mr-2 size-4" />
            Share
          </Button>
        </div>
        <div className="space-y-3">
          <EventDetailRow
            icon={<CalendarClockIcon className="text-muted-foreground" />}
            text={
              formatDate(data.eventDate, "do MMM") +
              " at " +
              formatDate(data.eventDate, "hh:mm a")
            }
          />
          <EventDetailRow
            icon={<MapPinIcon className="text-muted-foreground" />}
            text={data.location ?? "Location not set"}
          />
          <EventDetailRow
            icon={<Users2Icon className="text-muted-foreground" />}
            text={`${data.eventRegistrations.length} ${
              data.eventRegistrations.length === 1 ? "person" : "people"
            } registered`}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Host</h2>
          <Link href={`/clubs/${data.club.id}`}>
            <div className="mt-3 flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={data.club.image ?? ""} alt={data.club.name} />
                <AvatarFallback>
                  {getInitials(data.club.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none">{data.club.name}</p>
              </div>
            </div>
          </Link>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Participants</h2>
          <div className="mt-3 space-y-4">
            {data.eventRegistrations.map((registration) => {
              const member = registration.member;
              return (
                <div
                  className="flex items-center space-x-4"
                  key={registration.eventId + registration.memberId}
                >
                  <Avatar>
                    <AvatarImage
                      src={member.image ?? ""}
                      alt={member.name ?? ""}
                    />
                    <AvatarFallback>
                      {getInitials(member.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-none">{member.name}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {getYearOfStudy(member.yearOfStudy)} year |{" "}
                      {member.degree} | {member.department}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

type EventDetailRowProps = {
  icon: React.ReactNode;
  text: string;
};

function EventDetailRow({ icon, text }: EventDetailRowProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="h-screen !bg-white">
      <Skeleton className="h-[270px] w-full" />
      <div className="container mx-auto mt-4 max-w-md space-y-4 !bg-white px-4">
        <div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="h-6 w-1/4" />
          <div className="mt-3 flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
        <div>
          <Skeleton className="h-6 w-1/3" />
          <div className="mt-3 flex items-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
