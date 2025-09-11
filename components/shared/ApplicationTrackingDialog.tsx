"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationTracker } from "@/hooks/useApplicationTracker";
import {
  applicationTrackingSchema,
  ApplicationTrackingValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/shared/DatePicker";

// Helper function to format date in local timezone (YYYY-MM-DD)
const formatDateForInput = (date: Date): string => {
  // Ensure we're working with a date that represents the local date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface ApplicationTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcementId: number;
  announcementTitle: string;
}

export default function ApplicationTrackingDialog({
  open,
  onOpenChange,
  announcementId,
  announcementTitle,
}: ApplicationTrackingDialogProps) {
  const { createOrUpdateTracker, isUpdatingTracker, currentTracker } =
    useApplicationTracker(announcementId);

  const form = useForm<ApplicationTrackingValues>({
    resolver: zodResolver(applicationTrackingSchema),
    defaultValues: {
      status: "not applied",
      notes: "",
      reminder_date: undefined,
    },
  });

  // Local state for DatePicker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set to start of day

  // Update form with existing tracker data
  useEffect(() => {
    if (currentTracker) {
      let reminderDate: Date | undefined = undefined;

      if (currentTracker.reminder_date) {
        reminderDate = new Date(currentTracker.reminder_date);
        // Ensure the date is set to noon in local timezone
        reminderDate.setHours(12, 0, 0, 0);
      }

      form.reset({
        status: currentTracker.status || "not applied",
        notes: currentTracker.notes || "",
        reminder_date: reminderDate ? formatDateForInput(reminderDate) : "",
      });

      setSelectedDate(reminderDate);
    }
  }, [currentTracker, form]);

  const onSubmit = (data: ApplicationTrackingValues) => {
    createOrUpdateTracker(
      { announcementId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Track Application
          </DialogTitle>
          <DialogDescription className="text-sm">
            Keep track of your application for: {announcementTitle}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Status</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          field.value === "applied" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => field.onChange("applied")}
                        // disabled={isUpdatingTracker || isLoadingTracker}
                        disabled={isUpdatingTracker}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </Button>
                      <Button
                        type="button"
                        variant={
                          field.value === "not applied" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => field.onChange("not applied")}
                        // disabled={isUpdatingTracker || isLoadingTracker}
                        disabled={isUpdatingTracker}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Not Applied
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about your application, requirements, or any other details..."
                      rows={3}
                      {...field}
                      disabled={isUpdatingTracker}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reminder_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Date (Optional)</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        if (date) {
                          // Ensure the date is set to noon in local timezone to avoid timezone conversion issues
                          const adjustedDate = new Date(date);
                          adjustedDate.setHours(12, 0, 0, 0);
                          setSelectedDate(adjustedDate);
                          field.onChange(formatDateForInput(adjustedDate));
                        } else {
                          setSelectedDate(undefined);
                          field.onChange("");
                        }
                      }}
                      disabled={isUpdatingTracker}
                      startYear={new Date().getFullYear()}
                      endYear={new Date().getFullYear() + 5}
                      minDate={tomorrow}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdatingTracker}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingTracker}
                className="flex-1"
              >
                {isUpdatingTracker ? "Saving..." : "Save Tracker"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
