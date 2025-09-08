"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserRegisterForm from "@/components/shared/UserRegisterForm";
import OrganizationRegisterForm from "@/components/shared/OrganizationRegisterForm";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/awn.png";

export default function ClientPageRegister() {
  const [activeTab, setActiveTab] = useState("user");

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash === "organization") {
      setActiveTab("organization");
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl border-0 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/95 pt-0">
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
            Join Our Platform
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 font-medium max-w-xs">
            Create your account to get started
          </CardDescription>
        </div>
      </CardHeader>

      <Tabs className="px-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="user" className="cursor-pointer">
            User
          </TabsTrigger>
          <TabsTrigger value="organization" className="cursor-pointer">
            Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user" id="user">
          <CardContent className="p-0 pb-8">
            <div className="space-y-2 mb-6 text-center">
              <h3 className="text-xl font-semibold bg-hero-gradient bg-clip-text text-transparent">
                User Registration
              </h3>
              <p className="text-muted-foreground/80 text-sm">
                Please fill in the details to register as a user.
              </p>
            </div>
            <UserRegisterForm />
          </CardContent>
        </TabsContent>
        <TabsContent value="organization" id="organization">
          <CardContent className="p-0 pb-8">
            <div className="space-y-2 mb-6 text-center">
              <h3 className="text-xl font-semibold bg-hero-gradient bg-clip-text text-transparent">
                Organization Registration
              </h3>
              <p className="text-muted-foreground/80 text-sm">
                Join our platform to connect with those in need and make a
                difference
              </p>
            </div>
            <OrganizationRegisterForm />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
