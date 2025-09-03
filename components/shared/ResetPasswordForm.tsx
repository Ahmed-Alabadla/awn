"use client";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ResetPasswordFormProps {
  userId: string;
  token: string;
}

export default function ResetPasswordForm({
  userId,
  token,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    console.log("Resetting password for user:", userId);
    console.log("Reset token:", token);
    console.log("New password:", data.password);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>
        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="password_confirm">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password_confirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("password_confirm")}
              aria-invalid={!!errors.password_confirm}
              aria-describedby={
                errors.password_confirm ? "confirm-password-error" : undefined
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password_confirm && (
            <p
              id="confirm-password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.password_confirm.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" variant="hero">
          {/* {isLoading ? "Resetting Password..." : "Reset Password"} */}
          <span>Reset Password</span>
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
