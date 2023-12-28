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
import { SigninValidationSchema } from "@/lib/validation";

import { Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import { auth } from "@/lib/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useAuthStore, IAuthStore } from "@/store/authStore";

const SigninForm = () => {
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  // const logInUser = useAuthStore((state: IAuthStore) => state.login);

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(userData: z.infer<typeof SigninValidationSchema>) {
    console.log("userdata", userData);
    try {
      const isUser = await signInWithEmailAndPassword(
        userData.email,
        userData.password
      );
      if (!isUser) {
        if (error) {
          console.log(error);
          toast({ title: "Unable to log in", description: `${error.message}` });
        }
        return;
      }
      if (isUser) {
        toast({ title: "Logged in successfully" })
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Unable to log in" });
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <Card className="w-full ">
        <CardHeader className="">
          <div className="flex items-baseline justify-center gap-2 mb-8">
            <Logo />
            <h1 className="text-h1-semibold ">ShareBase</h1>
          </div>

          <CardTitle className="">Log In</CardTitle>

          <CardDescription>
            Welcome back
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="someone@example.com"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant={"primary-shadow-lg"}
                className="w-full transition"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? `Please wait` : `Submit`}
              </Button>
            </form>
          </Form>

          <div className="gap-2 flex-center">
            <div className="flex-1 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
            OR
            <div className="flex-1 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
          </div>

          {/* GoogleAuth  */}
          <Button variant={"secondary"} className="w-full">
            Log in with Google
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full h-12">
        <p className="w-full h-full gap-1 text-sm text-slate-400 flex-center">
          Don't have an account?{" "}
          <Link
            to={"/sign-up"}
            className="text-purple-6 dark:text-purple-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}

export { SigninForm };
