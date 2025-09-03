"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

// Mock data for organizations
const MOCK_ORGANIZATIONS = [
  "Children's Hope Foundation",
  "Future Leaders Institute",
  "Community Care Network",
  "Water for All",
  "Relief Now",
  "EmpowerHer",
];

type ReportType = "bug" | "organization";

export default function ReportsSection() {
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [organization, setOrganization] = useState<string>("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || (reportType === "organization" && !organization)) {
      toast.error("Please fill out all required fields.");
      return;
    }

    console.log({
      reportType,
      organization: reportType === "organization" ? organization : undefined,
      title,
      message,
    });

    toast.success("Your feedback has been submitted successfully!");

    // Reset form
    setTitle("");
    setMessage("");
    setOrganization("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Submit Feedback or Report an Issue</h2>
      <p className="text-muted-foreground mb-6">
        Let us know if you&apos;ve found a bug or have feedback for an organization.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Select the type of feedback you want to provide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Feedback Type</label>
              <select
                className="w-full border rounded px-3 py-2 bg-background"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="bug">Report a Bug in the Application</option>
                <option value="organization">Report a Problem with an Organization</option>
              </select>
            </div>

            {reportType === "organization" && (
              <div className="space-y-2 animate-fade-in">
                <label htmlFor="organization" className="font-medium">
                  Organization
                </label>
                <select
                  id="organization"
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                >
                  <option value="" disabled>
                    Select an organization
                  </option>
                  {MOCK_ORGANIZATIONS.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a brief title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Please provide a detailed description."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full">
              Send Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
