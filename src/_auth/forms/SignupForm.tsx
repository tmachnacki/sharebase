import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupValidationSchema } from "@/lib/validation";

import { Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();


  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(userData: z.infer<typeof SignupValidationSchema>) {
    console.log('data', userData)
  }

  return (
    <Form {...form}>
      <Card className="w-full max-w-md ">
        <CardHeader className="">
          <div className="flex items-baseline justify-center gap-2 mb-8">
            <Logo />
            <h1 className="text-h1-semibold ">SnapWrite</h1>
          </div>

          <CardTitle className="">
            Get Started
          </CardTitle>

          <CardDescription>Enter some account details to start sharing</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="JDoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="someone@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-8">
            <Button type="submit" variant={"primary-shadow-lg"} className="w-full transition" disabled={isCreatingAccount}>
              {(isCreatingAccount) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {(isCreatingAccount) ? `Please wait` : `Submit`}
            </Button>

            <p className="text-sm text-slate-400">
              Already have an account? <Link to={"/login"} className="text-purple-6 dark:text-purple-4 hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </Form>
  )

}

export { SignupForm };
