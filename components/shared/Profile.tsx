"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import {
  ChangePasswordFormValues,
  changePasswordSchema,
  ProfileFormValues,
  profileSchema,
} from "@/lib/validation";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { useAuth } from "@/hooks/useAuth";
import { ImageDropzone } from "./ImageDropzone";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const {
    user,
    changePassword,
    isChangePasswordPending,
    updateProfile,
    isUpdateProfilePending,
  } = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      profile_image: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
        profile_image: user.profile_image || undefined,
      });
    }
  }, [user, profileForm]);

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const passwordValue = changePasswordForm.watch("new_password") || "";
  const { message, getColor, getPercentage } =
    usePasswordStrength(passwordValue);

  const onSubmitUpdateProfile = (data: ProfileFormValues) => {
    updateProfile(data);
  };
  const onSubmitChangePassword = (data: ChangePasswordFormValues) => {
    changePassword(data, {
      onSuccess: () => {
        changePasswordForm.reset();
      },
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitUpdateProfile)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="profile_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile image</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      width={250}
                      height={250}
                      value={field.value ?? undefined}
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account details
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      readOnly
                      defaultValue={user?.email || ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role || ""} readOnly />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isUpdateProfilePending || !profileForm.formState.isDirty
                }
              >
                {isUpdateProfilePending ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
        <Separator className="dark:bg-gray-500" />

        <form
          onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Change your password
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    {...changePasswordForm.register("old_password")}
                    disabled={isChangePasswordPending}
                    placeholder="Password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {changePasswordForm.formState.errors.old_password && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.old_password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    {...changePasswordForm.register("new_password")}
                    disabled={isChangePasswordPending}
                    placeholder="Password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordValue && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${getColor()}`}
                        style={{ width: getPercentage() }}
                      />
                    </div>
                    {message && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        {message}
                      </p>
                    )}
                  </div>
                )}
                {changePasswordForm.formState.errors.new_password && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmNewPassword ? "text" : "password"}
                    {...changePasswordForm.register("new_password_confirm")}
                    disabled={isChangePasswordPending}
                    placeholder="Password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    aria-label={
                      showConfirmNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {changePasswordForm.formState.errors.new_password_confirm && (
                  <p className="text-sm text-red-500">
                    {
                      changePasswordForm.formState.errors.new_password_confirm
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isChangePasswordPending}>
              {isChangePasswordPending ? "Processing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
