import { Logo } from "@/components/shared/logo";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SigninValidationSchema } from "@/lib/validation";

import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { auth, firestore } from "@/lib/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useAuthStore, IAuthStore } from "@/store/authStore";
import { doc, getDoc } from "firebase/firestore";
import { GoogleAuth } from "./GoogleAuth";

const SigninForm = () => {
  const [signInWithEmailAndPassword, , loading] =
    useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const logInUser = useAuthStore((state: IAuthStore) => state.login);

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(userData: z.infer<typeof SigninValidationSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        userData.email,
        userData.password,
      );
      if (userCredential) {
        const userDocRef = doc(firestore, "users", userCredential.user.uid);
        const userSnapShot = await getDoc(userDocRef);

        if (userSnapShot.exists()) {
          // console.log(userSnapShot.data());
          localStorage.setItem(
            "user-info",
            JSON.stringify(userSnapShot.data()),
          );
          logInUser(userSnapShot.data());
          toast.success(
            `Logged in as ${
              userSnapShot.data()?.username
                ? userSnapShot.data().username
                : "succesfully"
            }`,
          );
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to log in", { description: `${error}` });
    }
  }

  return (
    <div className="xs:max-w-md w-full space-y-4">
      <Card className="xs:rounded-2xl w-full rounded-none bg-white/60 backdrop-blur dark:bg-slate-950/60">
        <CardHeader className="">
          <div className="mb-8 flex items-baseline justify-center gap-2">
            <Logo />
            <h1 className="text-3xl font-semibold ">ShareBase</h1>
          </div>

          <CardTitle className="">Log In</CardTitle>

          <CardDescription>Welcome back</CardDescription>
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
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? `Please wait` : `Submit`}
              </Button>
            </form>
          </Form>

          <div className="flex-center gap-2 text-slate-400 dark:text-slate-500">
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            or
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {/* GoogleAuth  */}
          <GoogleAuth isSignIn={true} />
        </CardContent>
      </Card>
      <Card className="xs:rounded-2xl h-12 w-full rounded-none bg-white/60 backdrop-blur dark:bg-slate-950/60">
        <p className="flex-center h-full w-full gap-1 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to={"/sign-up"}
            className="text-purple-6 hover:underline dark:text-purple-4"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export { SigninForm };
