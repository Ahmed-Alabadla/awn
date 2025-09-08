import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/shared/ForgotPasswordForm";
import Image from "next/image";
import logo from "@/public/awn.png";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
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
            Forgot Password
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 font-medium max-w-xs">
            Enter your email address to receive a password reset link
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
