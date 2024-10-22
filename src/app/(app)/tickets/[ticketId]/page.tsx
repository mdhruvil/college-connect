"use client";
import { centerText, Scanner } from "@yudiel/react-qr-scanner";
import { LoaderIcon, TicketCheckIcon, TicketXIcon } from "lucide-react";
import { api } from "~/trpc/react";

export default function TicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const checkTicketValidity = api.ticket.checkTicketValidity.useMutation();

  if (checkTicketValidity.isPending) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LoaderIcon className="size-10 animate-spin" />
        <p className="mt-3 text-lg font-semibold">
          Checking ticket validity...
        </p>
      </div>
    );
  }

  if (checkTicketValidity.isSuccess) {
    if (checkTicketValidity.data) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-green-600">
          <TicketCheckIcon className="size-10" />
          <p className="mt-3 text-lg font-semibold">Ticket is valid</p>
        </div>
      );
    } else {
      return (
        <div className="flex h-full flex-col items-center justify-center text-red-600">
          <TicketXIcon className="size-10" />
          <p className="mt-3 text-lg font-semibold">Ticket is invalid</p>
        </div>
      );
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <Scanner
          onScan={([data]) => {
            console.log(data);
            if (!data) {
              return;
            }
            if (data.format === "unknown") {
              return;
            }
            if (
              checkTicketValidity.isPending ||
              checkTicketValidity.isSuccess
            ) {
              return;
            }
            checkTicketValidity.mutate({
              ticketId: params.ticketId,
              eventCode: isNaN(parseInt(data.rawValue))
                ? 0
                : parseInt(data.rawValue),
            });
          }}
          components={{
            audio: true,
            zoom: true,
            torch: true,
            finder: true,
            onOff: true,
            tracker: centerText,
          }}
          formats={["qr_code", "rm_qr_code", "micro_qr_code"]}
          scanDelay={1000}
        />
      </div>
    </div>
  );
}
