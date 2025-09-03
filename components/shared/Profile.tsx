"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
  ProfileFormValues,
  profileSchema,
} from "@/lib/validation";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { useAuth } from "@/hooks/useAuth";
import { ImageDropzone } from "./ImageDropzone";

export default function Profile() {
  const { user } = useAuth();

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

  const passwordValue = changePasswordForm.watch("newPassword") || "";
  const { message, getColor, getPercentage } =
    usePasswordStrength(passwordValue);

  const onSubmitUpdateProfile = (data: ProfileFormValues) => {
    console.log(profileForm);
    console.log(data);
  };
  const onSubmitChangePassword = (data: ChangePasswordFormValues) => {
    console.log(data);
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
                            value={field.value!}
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
                // disabled={
                //   updateProfile.isPending || !profileForm.formState.isDirty
                // }
              >
                Update Profile
                {/* {updateProfile.isPending ? "Processing..." : "Update Profile"} */}
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
                <Input
                  id="current-password"
                  type="password"
                  {...changePasswordForm.register("oldPassword")}
                  placeholder="Password"
                />
                {changePasswordForm.formState.errors.oldPassword && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...changePasswordForm.register("newPassword")}
                  placeholder="Password"
                />
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
                {changePasswordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  {...changePasswordForm.register("confirmPassword")}
                  placeholder="Password"
                />
                {changePasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {
                      changePasswordForm.formState.errors.confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              // disabled={
              //   changePassword.isPending ||
              //   !changePasswordForm.formState.isDirty
              // }
            >
              Change Password
              {/* {changePassword.isPending ? "Processing..." : "Change Password"} */}
            </Button>
          </div>
        </form>

        <Separator className="dark:bg-gray-500" />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
                {/* {deleteProfile.isPending ? "Deleting..." : "Delete Account"} */}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-gray-500">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  // onClick={handleDeleteProfile}
                  className="bg-red-600  dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-600"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
