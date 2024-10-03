"use client";
import { QrCodeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ErrorWithLogin } from "~/components/error-with-login";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

function TicketSkeleton() {
  return (
    <div className="flex items-center space-x-4 rounded-md border-b bg-white p-2 shadow last:border-b-0">
      <div className="flex-shrink-0">
        <Skeleton className="h-[60px] w-[60px] rounded-md" />
      </div>
      <div className="flex-grow">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
      <div>
        <Skeleton className="h-6 w-6" />
      </div>
    </div>
  );
}

export default function Tickets() {
  const { data, isLoading, error } = api.ticket.getTickets.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 w-11/12 space-y-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <TicketSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data)
    return (
      <div>
        <ErrorWithLogin errorMsg={error?.message ?? "Failed to load tickets"} />
      </div>
    );

  return (
    <>
      <div className="mx-auto mt-8 w-11/12 space-y-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="space-y-2">
          {data.map((ticket) => (
            <Link
              href={`/tickets/${ticket.id}`}
              key={ticket.id}
              className="block"
            >
              <div
                key={ticket.id}
                className="flex items-center space-x-4 rounded-md border-b bg-white p-2 shadow last:border-b-0"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={ticket.event.image ?? ""}
                    alt={ticket.event.name}
                    width={60}
                    height={60}
                    className="aspect-square rounded-md object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{ticket.event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ticket.status}
                  </p>
                </div>
                <div>
                  <QrCodeIcon className="mr-3 size-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
