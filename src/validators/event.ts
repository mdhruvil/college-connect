import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  image: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), "Please Select Image")
        .refine(
          (file) => file.size <= 1024 * 1024,
          "Image size must be less than 1MB",
        ),
    )
    .nonempty({ message: "Please select an image" }),
  clubId: z.string().min(1, "Club is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  location: z.string().optional(),
  type: z.enum(["ONLINE", "OFFLINE"], {
    required_error: "Event type is required",
  }),
});
