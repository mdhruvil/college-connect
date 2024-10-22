"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { FileUploader } from "~/components/file-uploader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useUploadFile } from "~/hooks/use-upload-file";
import { createClubSchema } from "~/validators/club";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateClubPage() {
  const router = useRouter();
  const createClub = api.club.create.useMutation({
    onSuccess: () => {
      router.replace("/clubs");
    },
    onError(error) {
      toast.error(error.message, {
        richColors: true,
      });
    },
  });

  const { onUpload, progresses, isUploading } = useUploadFile("imageUploader", {
    defaultUploadedFiles: [],
  });

  const form = useForm<z.infer<typeof createClubSchema>>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createClubSchema>) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const loadingToast = toast.loading("Uplading Image");
      const uploadedFiles = await onUpload(values.image);
      toast.dismiss(loadingToast);
      if (!uploadedFiles?.length || !uploadedFiles[0]) {
        throw new Error("No Image Uploaded");
      }
      toast.promise(
        createClub.mutateAsync({
          name: values.name,
          description: values.description,
          image: uploadedFiles[0].url,
        }),
        {
          loading: "Creating club...",
          success: "Club created successfully",
          error: "Failed to create club",
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

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Create New Club
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter club name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique name for your club.
                    </FormDescription>
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
                        placeholder="Describe your club"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of your club&apos;s purpose
                      and activities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormLabel>Images</FormLabel>
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
                  </div>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                loading={createClub.isPending || isUploading}
              >
                Create Club
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
