"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { FileUploader } from "~/components/file-uploader";
import RadioButtonGroup from "~/components/radio-button-groups";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { Textarea } from "~/components/ui/textarea";
import { useUploadFile } from "~/hooks/use-upload-file";
import { api } from "~/trpc/react";
import { createEventSchema } from "~/validators/event";
import { ErrorWithLogin } from "~/components/error-with-login";

export default function EventCreationForm() {
  const createEvent = api.event.create.useMutation();
  const {
    data: clubs,
    isLoading,
    error,
  } = api.club.getClubsOwnedByUser.useQuery();

  const { onUpload, progresses, isUploading } = useUploadFile("imageUploader", {
    defaultUploadedFiles: [],
  });

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventDate: new Date(),
      type: "OFFLINE",
    },
  });

  async function onSubmit(values: z.infer<typeof createEventSchema>) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const loadingToast = toast.loading("Uplading Image");
      const uploadedFiles = await onUpload(values.image);
      toast.dismiss(loadingToast);
      if (!uploadedFiles?.length || !uploadedFiles[0]) {
        throw new Error("No Image Uploaded");
      }
      toast.promise(
        createEvent.mutateAsync({
          ...values,
          image: uploadedFiles[0].url,
        }),
        {
          loading: "Creating event...",
          success: "Event created successfully",
          error: "Failed to create event",
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create club. Please try again later.");
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !clubs) {
    return (
      <div className="container mx-auto max-w-md space-y-4 px-4 py-8">
        <ErrorWithLogin errorMsg={error?.message ?? "Failed to load clubs"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter event description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFileCount={1}
                        maxSize={1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubs.length ? (
                          clubs.map((club) => (
                            <SelectItem key={club.id} value={club.id}>
                              {club.name}
                            </SelectItem>
                          ))
                        ) : (
                          <>You haven&apos;t created any clubs yet.</>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Input
                      type="datetime-local"
                      // @ts-expect-error valueAsDate is allowed
                      valueAsDate={field.value}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <RadioButtonGroup
                        options={[
                          {
                            value: "OFFLINE",
                            label: "Offline",
                          },
                          {
                            value: "ONLINE",
                            label: "Online",
                          },
                        ]}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" loading={createEvent.isPending}>
                Create Event
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
