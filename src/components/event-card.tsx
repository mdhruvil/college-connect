import { formatDate } from "date-fns";
import { CalendarClockIcon, MapPinIcon, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

type EventCardProps = {
  name: string;
  image: string;
  date: Date;
  location: string;
  registrationCount: number;
  id: string;
  description: string;
  clubName: string;
};

export function EventCard({
  name,
  image,
  date,
  location,
  registrationCount,
  id,
  description,
  clubName,
}: EventCardProps) {
  return (
    <div className="mx-auto overflow-hidden rounded-lg bg-card text-card-foreground shadow">
      <Link href={`/events/${id}`}>
        <Image
          className="h-[200px] w-full rounded-t-lg object-cover"
          src={image}
          alt={`Thumbnail for ${name}`}
          height={200}
          width={320}
        />
        <div className="px-4 py-3">
          <div className="line-clamp-2 text-lg font-bold" title={name}>
            {name}
          </div>
          <div className="line-clamp-2 text-sm text-muted-foreground/60">
            {description}
          </div>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Event by {clubName}
          </p>
          <div className="mt-2 space-y-1">
            <EventCardDetailsWithIcon
              icon={
                <CalendarClockIcon className="size-3.5 text-muted-foreground" />
              }
              text={
                formatDate(date, "do MMM") +
                " at " +
                formatDate(date, "hh:mm a")
              }
            />
            <EventCardDetailsWithIcon
              icon={<MapPinIcon className="size-3.5 text-muted-foreground" />}
              text={location}
            />
            <EventCardDetailsWithIcon
              icon={<Users2Icon className="size-3.5 text-muted-foreground" />}
              text={`${registrationCount} ${
                registrationCount === 1 ? "person" : "people"
              } registered`}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

type EventCardDetailsWithIconProps = {
  icon: React.ReactNode;
  text: string;
};

function EventCardDetailsWithIcon({
  icon,
  text,
}: EventCardDetailsWithIconProps) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="mx-auto overflow-hidden rounded-lg bg-card text-card-foreground shadow">
      <Skeleton className="h-[200px] w-full rounded-t-lg" />
      <div className="px-4 py-3">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-2/3" />
        <Skeleton className="mb-2 h-3 w-1/2" />
        <div className="mt-2 space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
