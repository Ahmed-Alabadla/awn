import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import LoginForm from "@/components/shared/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center space-y-2 mt-2">
        <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent">
          Login
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
