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

export const MAX_IMAGE_FILE_SIZE =  1024 * 1024 * 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const EditProfileValidationSchema = z.object({
  // profilePic: z
  //   .any()
  //   .optional()
  //   // .refine(
  //   //   file => file.length == 1 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) ? true : false : true, 
  //   //   ".jpg, .jpeg, .png and .webp files are accepted."
  //   // )
  //   // .refine(
  //   //   file => file.length == 1 ? file[0]?.size <= MAX_PROFILE_FILE_SIZE ? true : false : true, 
  //   //   'Max file size allowed is 8MB.'
  //   // ),
  //   .refine(
  //     (files) => files ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type) : true,
  //     ".jpg, .jpeg, .png and .webp files are accepted."
  //   )
  //   .refine((files) => files ? files?.[0]?.size <= MAX_PROFILE_FILE_SIZE : true, `Max file size is 5MB.`),
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters ' }),
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  bio: z.string().max(2200, { message: "Bio must not be longer than 2200 characters" })
})

export const CreatePostValidationSchema = z.object({
  // images
  caption: z.string().max(2200, { message: "caption must be less than 2200 characters" }).optional(),
  location: z.string().max(2200, { message: "location must be less than 2200 characters" }).optional(),
  tags: z.array(z.string()).optional()
})