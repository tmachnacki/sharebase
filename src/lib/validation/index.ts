import * as z from "zod";

export const SignupValidationSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters ' }),
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  email: z.string({ required_error: "A valid email is required" }).email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
})

export const SigninValidationSchema = z.object({
  email: z.string({ required_error: "A valid email is required" }).email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
})

const MAX_FILE_SIZE =  1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const EditProfileValidationSchema = z.object({
  // profilePic: z
  //   .any()
  //   .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     ".jpg, .jpeg, .png and .webp files are accepted."
  //   ).optional(),
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters ' }),
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  bio: z.string().max(2200, { message: "Bio must not be longer than 2200 characters" })
})