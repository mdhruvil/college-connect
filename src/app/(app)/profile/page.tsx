"use client";

import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getYearOfStudy } from "~/lib/utils";
import { api } from "~/trpc/react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Alert, AlertTitle } from "~/components/ui/alert";

export default function Profile() {
  const { data, isLoading, error } = api.user.profile.useQuery();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !data) {
    toast.error(error?.message);
    return (
      <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          {error?.message ?? "Failed to load profile"}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
      {/* Profile */}
      <Card className="w-full">
        <CardHeader className="space-y-0 text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24">
            <AvatarImage
              src={data.user.image ?? ""}
              alt={data.user.name ?? "Avatar"}
            />
            <AvatarFallback>
              {data.user
                .name!.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{data.user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{data.user.email}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Enrollment No.
              </p>
              <p className="font-semibold">{data.user.enrollmentNo}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Year of Study
              </p>
              <p className="font-semibold">
                {getYearOfStudy(data.user.yearOfStudy)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Degree</p>
            <p className="font-semibold">{data.user.degree}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Department
            </p>
            <p className="font-semibold">{data.user.department}</p>
          </div>
        </CardContent>
      </Card>

      {/* Clubs */}
      <Card className="mb-6 w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Clubs</CardTitle>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href="/clubs/new"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Club
          </Link>
        </CardHeader>
        <CardContent>
          {data.clubs.length ? (
            <ul className="space-y-4">
              {data.clubs.map((club, index) => (
                <Link
                  key={index}
                  href={`/clubs/${club.id}`}
                  className="flex items-start space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <li
                    key={index}
                    className="flex items-start space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={club.image ?? ""}
                        alt={club.name}
                        width={80}
                        height={80}
                        className="aspect-square rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {club.postition}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No clubs joined yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Events */}
      <Card className="mb-6 w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Events</CardTitle>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href="/events/new"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </CardHeader>
        <CardContent>
          {data.events.length ? (
            <ul className="space-y-4">
              {data.events.map((event, index) => (
                <Link
                  key={index}
                  href={`/events/${event.id}`}
                  className="flex items-start space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <li
                    key={index}
                    className="flex items-start space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={event.image ?? ""}
                        alt={event.name}
                        width={80}
                        height={80}
                        className="aspect-square rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.status}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No events attended yet.
            </p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          variant="destructive"
          className="mx-auto"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
      {/* Profile Skeleton */}
      <Card className="w-full">
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24">
            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="mx-auto h-8 w-48" />
          </CardTitle>
          <Skeleton className="mx-auto mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Enrollment No.
              </p>
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Year of Study
              </p>{" "}
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Degree</p>
            <Skeleton className="h-6 w-48" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Department
            </p>{" "}
            <Skeleton className="h-6 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Clubs Skeleton */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Clubs</CardTitle>
          <Button variant="outline" size="sm" disabled>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-grow">
                  <Skeleton className="mb-2 h-6 w-48" />
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
