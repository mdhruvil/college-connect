import { z } from "zod";

export const onboardingSchema = z.object({
  degree: z.string({ required_error: "Please select your degree" }),
  department: z.string({ required_error: "Please select your department" }),
  enrollmentNo: z.string({
    required_error: "Please enter your enrollment number",
  }),
  yearOfStudy: z.string({ required_error: "Please select your year of study" }),
});
