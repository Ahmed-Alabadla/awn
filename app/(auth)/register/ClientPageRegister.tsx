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

export default function ClientPageRegister() {
  const [activeTab, setActiveTab] = useState("user");

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash === "organization") {
      setActiveTab("organization");
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl shadow-elegant">
      <Tabs className="px-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="user" className="cursor-pointer">
            User
          </TabsTrigger>
          <TabsTrigger value="organization" className="cursor-pointer ">
            Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user" id="user">
          <CardHeader className="text-center space-y-2 mt-2">
            <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent ">
              User Registration
            </CardTitle>
            <CardDescription>
              Please fill in the details to register as a user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserRegisterForm />
          </CardContent>
        </TabsContent>
        <TabsContent value="organization" id="organization">
          <CardHeader className="text-center space-y-2 mt-2">
            <CardTitle className="text-2xl font-bold block bg-hero-gradient bg-clip-text text-transparent">
              Organization Registration
            </CardTitle>
            <CardDescription>
              Join our platform to connect with those in need and make a
              difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationRegisterForm />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
