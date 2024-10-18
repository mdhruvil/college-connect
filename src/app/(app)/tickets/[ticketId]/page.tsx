/* eslint-disable @next/next/no-img-element */
"use client";

import { formatDate } from "date-fns";
import { CalendarClockIcon, MapPinIcon } from "lucide-react";
import { ErrorWithLogin } from "~/components/error-with-login";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default function TicketPage({ params }: TicketPageProps) {
  const { data, isLoading, error } = api.ticket.getTicketById.useQuery({
    ticketId: params.ticketId,
  });

  if (isLoading) {
    return (
      <div className="mx-auto mt-12 w-11/12 space-y-4">
        <Skeleton className="mx-auto h-[200px] w-[200px] rounded" />
        <div className="space-y-4">
          <Skeleton className="mx-auto h-8 w-3/4" />
          <Skeleton className="mx-auto h-6 w-2/3" />
          <Skeleton className="mx-auto h-4 w-1/2" />
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data)
    return (
      <div className="mx-auto mt-8 w-11/12 space-y-4">
        <ErrorWithLogin errorMsg={error?.message ?? "Failed to load ticket"} />
      </div>
    );

  return (
    <div className="mx-auto mt-12 w-11/12 space-y-4">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(data.qrSvg)}`}
        alt="QR Code"
        height={200}
        width={200}
        className="mx-auto rounded"
      />
      <div>
        <h2 className="text-center text-2xl font-bold">{data.member?.name}</h2>
        <p className="mt-3 text-center text-lg">{data.event?.name}</p>
        <p className="text-center text-muted-foreground">
          Event by {data.event?.club?.name}
        </p>
        <div className="mt-4 flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarClockIcon className="size-4" />
            {formatDate(data.event?.eventDate ?? new Date(), "do MMM") +
              " at " +
              formatDate(data.event?.eventDate ?? new Date(), "hh:mm a")}
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4" />
            {data.event?.location ?? "Location not set"}
          </div>
        </div>
      </div>
    </div>
  );
}
