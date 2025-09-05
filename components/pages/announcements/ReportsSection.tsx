"use client";

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
import { useForm } from "react-hook-form";
import { ReportFormValues, reportSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReport } from "@/hooks/useReport";
import { useOrganizations } from "@/hooks/useOrganization";

export default function ReportsSection() {
  const { organizations, isLoadingOrganizations } = useOrganizations();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      target_org: "",
      type: "system",
    },
  });

  const watchedType = form.watch("type");

  const { generateReport, isGeneratingReport } = useReport();

  function onSubmit(values: ReportFormValues) {
    generateReport(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">
        Submit Feedback or Report an Issue
      </h2>
      <p className="text-muted-foreground mb-6">
        Let us know if you&apos;ve found a bug or have feedback for an
        organization.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Select the type of feedback you want to provide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isGeneratingReport}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="system">
                              Report a Bug in the Application
                            </SelectItem>
                            <SelectItem value="organization">
                              Report a Problem with an Organization
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedType === "organization" && (
                <FormField
                  control={form.control}
                  name="target_org"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel>Organization</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            isLoadingOrganizations ||
                            organizations?.length === 0 ||
                            isGeneratingReport
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {organizations?.map((org) => (
                                <SelectItem
                                  key={org.id}
                                  value={org.id.toString()}
                                >
                                  {org.organization_name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a brief title"
                        {...field}
                        disabled={isGeneratingReport}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed description."
                        rows={5}
                        {...field}
                        disabled={isGeneratingReport}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? "Generating..." : "Send Feedback"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
