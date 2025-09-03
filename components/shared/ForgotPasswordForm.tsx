"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/lib/validation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordForm() {
  const { forgotPassword, isForgotPasswordPending } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    forgotPassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            disabled={isForgotPasswordPending}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" variant="hero">
          {isForgotPasswordPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
