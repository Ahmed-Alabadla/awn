import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Invalid Reset Link",
  description: "The password reset link is invalid or missing parameters.",
};

export default function InvalidResetLinkPage() {
  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center space-y-2 mt-2">
        <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent">
          Invalid Reset Link
        </CardTitle>
        <CardDescription>
          The password reset link is invalid, expired, or missing required parameters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>If you need to reset your password, please request a new reset link.</p>
        </div>
        
        <div className="space-y-2">
          <Button asChild className="w-full" variant="hero">
            <Link href="/forgot-password">
              Request New Reset Link
            </Link>
          </Button>
          
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
