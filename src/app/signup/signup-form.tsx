"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth.schema";
import { signUp } from "@/services/auth.service";
import { APP_NAME, INSTITUTION_NAME } from "@/constants";

export default function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true);
    try {
      const { session } = await signUp(values);

      if (session) {
        // Email confirmation is disabled on this project — the user is
        // signed in immediately.
        toast.success("Account created! Welcome to SRMS.");
        router.push("/dashboard");
        router.refresh();
      } else {
        // Email confirmation is enabled — they must verify before signing in.
        toast.success("Account created! Check your email to confirm before signing in.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image src="/logo.jpeg" alt={INSTITUTION_NAME} width={56} height={56} className="rounded-md" />
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {INSTITUTION_NAME}
          </p>
          <h1 className="text-xl font-semibold">{APP_NAME}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
           
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
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
                        <Input placeholder="you@plaspoly.edu.ng" type="email" {...field} />
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
                       <PasswordInput placeholder="At least 6 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Create account
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}