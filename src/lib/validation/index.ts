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