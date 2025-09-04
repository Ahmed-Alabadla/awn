import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ResetPasswordForm from "@/components/shared/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Enter your email address to receive a link to reset your password and regain access to your TrendHub account.",
};

interface ResetPasswordPageProps {
  params: {
    userId: string;
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { userId, token } = params;

  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center space-y-2 mt-2">
        <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent">
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your new password and confirm it to reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm userId={userId} token={token} />
      </CardContent>
    </Card>
  );
}
