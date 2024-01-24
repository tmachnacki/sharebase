import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SignupValidationSchema } from "@/lib/validation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";

import { Logo } from "@/components/shared/logo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { UserDocument } from "@/types";
import { GoogleAuth } from "./GoogleAuth";

const SignupForm = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(userData: z.infer<typeof SignupValidationSchema>) {
    console.log("userdata", userData);

    const usersCollection = collection(firestore, "users");

    const usersQuery = query(
      usersCollection,
      where("username", "==", userData.username)
    );
    const usersSnapShot = await getDocs(usersQuery);

    if (!usersSnapShot.empty) {
      toast.error("Unable to sign up", {
        description: `Username '${userData.username}' already exists`,
      });
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );
      if (!newUser) {
        if (error) {
          console.log(error);
          toast("Unable to sign up", { description: `${error.message}` });
        }
        return;
      }
      if (newUser) {
        const userDoc: UserDocument = {
          uid: newUser.user.uid,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          bio: "",
          profilePicUrl: "",
          profileBannerUrl: "",
          followers: [],
          following: [],
          posts: [],
          saves: [],
          createdAt: new Date(Date.now()),
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user-info", JSON.stringify(userDoc));
        loginUser(userDoc);
        toast.success("Signed up successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to sign up", { description: `${error}` });
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

          <CardTitle className="">Get Started</CardTitle>

          <CardDescription>
            Enter some account details to start sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
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
          <GoogleAuth isSignIn={false} />
        </CardContent>
      </Card>
      <Card className="w-full h-12">
        <p className="w-full h-full gap-1 text-sm text-slate-400 flex-center">
          Already have an account?{" "}
          <Link
            to={"/sign-in"}
            className="text-purple-6 dark:text-purple-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export { SignupForm };
