import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/shared/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center space-y-2 mt-2">
        <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent">
          Forgot Password
        </CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
