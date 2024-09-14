"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DEGREES, DEPARTMENTS, YEAR_OF_STUDY } from "~/lib/constants";
import { onboardingSchema } from "~/validators/onboarding";
import { api } from "~/trpc/react";

type OnboardingFormProps = {
  user: User;
};

export function OnboardingForm({ user }: OnboardingFormProps) {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
  });

  const onboardingMutation = api.user.onboarding.useMutation({
    onSuccess: () => {
      console.log("success");
    },
  });

  function onSubmit(data: z.infer<typeof onboardingSchema>) {
    onboardingMutation.mutate({ ...data, userId: user.id });
  }

  return (
    <>
      <div className="mt-10">
        <p className="text-xl font-semibold">Hey {user.name?.split(" ")[0]}</p>
        <p className="text-sm">Let us know more about you</p>
      </div>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Degree */}
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your degree" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEGREES.map((degree) => {
                        return (
                          <SelectItem value={degree} key={degree}>
                            {degree}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((department) => {
                        return (
                          <SelectItem value={department} key={department}>
                            {department}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of study */}
            <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Of Study</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year of study" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEAR_OF_STUDY.map((year) => {
                        return (
                          <SelectItem value={year.value} key={year.value}>
                            {year.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enrollment No */}
            <FormField
              control={form.control}
              name="enrollmentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment No.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your enrollment number"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="ml-auto"
              loading={onboardingMutation.isPending}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
