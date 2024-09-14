"use client";

import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getYearOfStudy } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function Profile() {
  const { data, isLoading } = api.user.profile.useQuery();

  if (isLoading || !data) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
      {/* Profile */}
      <Card className="w-full">
        <CardHeader className="text-center">
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
          <p className="text-muted-foreground">{data.user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Enrollment No.
              </p>
              <p className="text-lg font-semibold">{data.user.enrollmentNo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Year of Study
              </p>
              <p className="text-lg font-semibold">
                {getYearOfStudy(data.user.yearOfStudy)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Degree</p>
            <p className="text-lg font-semibold">{data.user.degree}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Department
            </p>
            <p className="text-lg font-semibold">{data.user.department}</p>
          </div>
        </CardContent>
      </Card>

      {/* Clubs */}
      <Card className="mb-6 w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Clubs</CardTitle>
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </CardHeader>
        <CardContent>
          {data.clubs.length ? (
            <ul className="space-y-4">
              {data.clubs.map((club, index) => (
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
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No clubs joined yet
            </p>
          )}
        </CardContent>
      </Card>
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
