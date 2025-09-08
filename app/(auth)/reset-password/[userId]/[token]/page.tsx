import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ResetPasswordForm from "@/components/shared/ResetPasswordForm";
import Image from "next/image";
import logo from "@/public/awn.png";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Enter your email address to receive a link to reset your password and regain access to your TrendHub account.",
};

interface ResetPasswordPageProps {
  params: Promise<{
    userId: string;
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { userId, token } = await params;

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/95 pt-0">
      <CardHeader className="relative flex flex-col items-center text-center space-y-6 pt-8 pb-6 rounded-t-xl">
        <div className="relative">
          <Image
            src={logo}
            alt="Logo"
            width={96}
            height={96}
            className="relative z-10 transition-transform duration-300"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 font-medium max-w-xs">
            Enter your new password and confirm it to reset your password.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <ResetPasswordForm userId={userId} token={token} />
      </CardContent>
    </Card>
  );
}
