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
import { createUserAccount, login } from "@/lib/appwrite/api";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useLogin } from "@/lib/react-query/queriesAndMutations";
import { title } from "process";
import { useAuthContext } from "@/context/authContext";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();


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

  async function onSubmit(data: z.infer<typeof SignupValidationSchema>) {
    const newUser = await createUserAccount(data);

    if (!newUser) {
      return toast({ title: 'Sign up failed. Please try again.' });
    }

    const session = await login({
      email: data.email,
      password: data.password
    })

    if (!session) {
      return toast({ title: 'Log in failed. Please try again.' });
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate("/");

    } else {
      toast({ title: "Sign up failed. Please try again." });
    }
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
            <Button type="submit" variant={"primary-shadow"} className="w-full transition" disabled={isCreatingUser || isLoggingIn}>
              {(isCreatingUser || isLoggingIn) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {(isCreatingUser || isLoggingIn) ? `Please wait` : `Submit`}
            </Button>

            <p className="text-slate-400 text-sm">
              Already have an account? <Link to={"/login"} className="text-purple-6 dark:text-purple-4 hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </Form>
  )

}

export { SignupForm };
