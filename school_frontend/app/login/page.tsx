"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRegisterUser } from "@/query/mutations";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import Header from "../components/Header";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Default fallback location code
const DEFAULT_LOCATION_CODE = "GLOBAL1234";

const LoginPage = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [locationCode, setLocationCode] = useState(DEFAULT_LOCATION_CODE);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const registerUser = useRegisterUser();

  // Handle location fetching

  // Forms
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  // Handlers
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setError("");
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error || "Login failed");
    } else {
      toast.success("Login successful!");
      router.replace("/dashboard");
    }
    setIsLoading(false);
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setError("");
    setIsLoading(true);
    try {
      await registerUser.mutateAsync(
        {
          locationCode,
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: (data) => {
            setIsSignUp(false);
            toast.success("Signup successful!");
          },
          onError: () => {
            setError("Signup failed. Try again.");
          },
        }
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      <Header variant="auth" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[calc(100vh-120px)]">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-y-auto">
              <div className="max-w-sm mx-auto w-full">
                {/* Toggle Buttons */}
                <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      !isSignUp
                        ? "bg-white text-teal-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      isSignUp
                        ? "bg-white text-teal-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {isSignUp
                    ? "Join ConnectHub and start your learning journey"
                    : "Sign in to your ConnectHub account"}
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Sign In Form */}
                {isSignUp ? (
                  <Form key="singUp" {...signUpForm}>
                    <form
                      onSubmit={signUpForm.handleSubmit(handleSignUp)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm your password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        disabled={isLoading}
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-600 w-full"
                      >
                        {isLoading ? (
                          <p className="flex items-center justify-center gap-2">
                            Loading...{" "}
                            <Loader2 className="animate-spin" size={5} />
                          </p>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form key="signIn" {...signInForm}>
                    <form
                      onSubmit={signInForm.handleSubmit(handleSignIn)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        disabled={isLoading}
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-600 w-full"
                      >
                        {isLoading ? (
                          <p className="flex items-center justify-center gap-2">
                            Loading...{" "}
                            <Loader2 className="animate-spin" size={5} />
                          </p>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>

            {/* Right Side - Welcome Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-600 p-6 xl:p-12 flex-col justify-center items-center text-white">
              <div className="text-center max-w-sm xl:max-w-md">
                <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6">
                  {isSignUp ? "Welcome to ConnectHub!" : "Hello, Friend!"}
                </h2>
                <p className="text-teal-100 text-base xl:text-lg leading-relaxed mb-6 xl:mb-8">
                  {isSignUp
                    ? "Join our community of learners and educators. Start your journey with us today!"
                    : "Enter your details and continue your learning journey with us."}
                </p>
                <div className="w-16 h-16 xl:w-24 xl:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 xl:w-12 xl:h-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
