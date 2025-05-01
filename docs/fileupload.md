# File Upload Functionality

This document describes the file upload functionality implemented in the application using UploadThing. It explains how images are uploaded, processed, and stored, and describes the `useUploadFile` hook and the `imageUploader` FileRouter.

## Overview

The application uses UploadThing to handle file uploads, specifically for images. UploadThing provides a secure and efficient way to upload files directly to a cloud storage provider (in this case, likely AWS S3, though the specifics are abstracted away). The process involves:

1.  **Client-side Upload:** The user selects an image file through a file input component.
2.  **Server-side Processing:** The selected file is sent to the UploadThing server for processing.
3.  **Storage:** UploadThing stores the file in a configured cloud storage bucket.
4.  **URL Retrieval:** UploadThing returns a URL to the stored file, which can then be used by the application.

## `imageUploader` FileRouter

The `imageUploader` is a FileRoute defined in `app/api/uploadthing/core.ts`. It configures the upload process specifically for images.

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await getServerAuthSession();

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### Configuration:

*   `image`: Specifies that this route handles image files.
*   `maxFileSize`: Limits the maximum file size to 1MB.
*   `maxFileCount`: Limits the number of files uploaded to 1.
*   `.middleware()`: This function is executed on the server *before* the upload begins. It performs the following:
    *   Authenticates the user using `getServerAuthSession()`. If the user is not authenticated, it throws an `UploadThingError`.
    *   Returns metadata containing the user's ID, which will be available in the `onUploadComplete` function.
*   `.onUploadComplete()`: This function is executed on the server *after* the upload is complete. It performs the following:
    *   Logs the user ID and file URL to the console.
    *   Returns an object containing the user ID and file information to the client.

## `useUploadFile` Hook

The `useUploadFile` hook (`hooks/use-upload-file.ts`) simplifies the process of uploading files from React components. It manages the state of the upload, including progress, uploaded files, and uploading status.

```typescript
import * as React from "react";
import { toast } from "sonner";
import type { UploadFilesOptions } from "uploadthing/types";
import { type OurFileRouter } from "~/app/api/uploadthing/core";

import { type ClientUploadedFileData } from "uploadthing/types";
import { uploadFiles } from "~/lib/ut";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>;

interface UseUploadFileProps
  extends Pick{
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  } {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles]
    = React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses]
    = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file]: progress,
            };
          });
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
      return res;
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else if (isRedirectError(err)) {
    throw err;
  } else {
    return unknownError;
  }
}
```

### Usage:

1.  **Import the hook:**

    ```typescript
    import { useUploadFile } from "~/hooks/use-upload-file";
    ```

2.  **Call the hook:**

    ```typescript
    const { onUpload, uploadedFiles, progresses, isUploading } = useUploadFile("imageUploader", {
      defaultUploadedFiles: [],
    });
    ```

3.  **Use the returned values:**

    *   `onUpload`: A function that accepts an array of `File` objects and initiates the upload process.
    *   `uploadedFiles`: An array of `UploadedFile` objects representing the files that have been successfully uploaded.  Each object contains the `file` and `uploadedBy` properties.
    *   `progresses`: An object containing the upload progress for each file, keyed by the file name.
    *   `isUploading`: A boolean indicating whether an upload is currently in progress.

### Example:

Here's how the `useUploadFile` hook is used in the `CreateClubPage` component (`app/(app)/clubs/new/page.tsx`):

```typescript
  const { onUpload, progresses, isUploading } = useUploadFile("imageUploader", {
    defaultUploadedFiles: [],
  });

  async function onSubmit(values: z.infer<typeof createClubSchema>) {
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
```

In this example:

*   The `useUploadFile` hook is called with the `imageUploader` endpoint.
*   The `onUpload` function is called within the `onSubmit` function to upload the selected image.
*   The `progresses` and `isUploading` values are used to display the upload progress and disable the submit button while uploading.
*   The URL of the uploaded image is then used to create a new club.

## FileUploader Component

The `FileUploader` component (`components/file-uploader.tsx`) provides a user interface for selecting and uploading files. It uses the `react-dropzone` library to handle drag-and-drop functionality and displays a preview of the selected files.

### Props:

*   `value`:  The current array of `File` objects.
*   `onValueChange`:  A callback function that is called when the selected files change.
*   `onUpload`:  A callback function that is called when the user initiates the upload.
*   `progresses`:  An object containing the upload progress for each file.
*   `accept`:  An object specifying the accepted file types.
*   `maxSize`:  The maximum file size in bytes.
*   `maxFileCount`:  The maximum number of files that can be uploaded.
*   `multiple`:  A boolean indicating whether multiple files can be uploaded.
*   `disabled`:  A boolean indicating whether the uploader is disabled.

### Example:

```typescript
<FileUploader
  value={field.value}
  onValueChange={field.onChange}
  maxFileCount={1}
  maxSize={1024 * 1024}
  progresses={progresses}
  disabled={isUploading}
/>
```

## Error Handling

The `getErrorMessage` function (`hooks/use-upload-file.ts`) handles errors that may occur during the upload process. It checks for `ZodError` instances, standard `Error` instances, and redirect errors, and returns an appropriate error message.

## Conclusion

This documentation provides an overview of the file upload functionality in the application. By using UploadThing and the `useUploadFile` hook, the application provides a secure and efficient way for users to upload images.