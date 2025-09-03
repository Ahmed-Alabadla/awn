"use client";
import { useState } from "react";
import {
  organizationRegisterSchema,
  OrganizationRegisterValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function OrganizationRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { organizationRegister, isOrganizationRegisterPending } = useAuth();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<OrganizationRegisterValues>({
    resolver: zodResolver(organizationRegisterSchema),
    defaultValues: {
      phone: "",
      email: "",
      name: "",
      password: "",
      password_confirm: "",
      description: "",
      location: "",
      website: "",
    },
  });

  const onSubmit = async (data: OrganizationRegisterValues) => {
    organizationRegister(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter organization name"
              {...register("name")}
              disabled={isOrganizationRegisterPending}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>
          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="organization@example.com"
              {...register("email")}
              disabled={isOrganizationRegisterPending}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                disabled={isOrganizationRegisterPending}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
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
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("password_confirm")}
                disabled={isOrganizationRegisterPending}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+966 50 123 4567"
              {...register("phone")}
              disabled={isOrganizationRegisterPending}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">
              Website <span className="text-destructive">*</span>
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.example.com"
              {...register("website")}
              disabled={isOrganizationRegisterPending}
              aria-invalid={!!errors.website}
              aria-describedby={errors.website ? "website-error" : undefined}
            />
            {errors.website && (
              <p
                id="website-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.website.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter your location"
            {...register("location")}
            disabled={isOrganizationRegisterPending}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
          {errors.location && (
            <p className="text-sm text-destructive" role="alert">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your organization's mission and activities..."
            rows={4}
            {...register("description")}
            disabled={isOrganizationRegisterPending}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p className="text-sm text-destructive" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" variant="hero">
          <>
            {isOrganizationRegisterPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </>
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}
