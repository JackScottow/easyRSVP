"use client"; // Required for using hooks like useFormState

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Assuming you have toast for messages

// Import the server action and its state type
import { createEventAction, type CreateEventFormState } from "./_actions";

// Component to handle button pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Creating..." : "Create Event"}
    </Button>
  );
}

export default function CreateEventPage() {
  const { toast } = useToast(); // Initialize toast

  const initialState: CreateEventFormState = {
    message: null,
    errors: {},
    success: false,
  };

  // useFormState hook to manage form submission and feedback
  const [state, formAction] = useFormState(createEventAction, initialState);

  // Show toast message on success or error
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: "Success!", description: state.message, variant: "default" });
        // Optionally reset form or redirect here if not done in action
      } else {
        toast({ title: "Error", description: state.message, variant: "destructive" });
      }
    }
  }, [state, toast]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl px-4 py-6 md:py-10">
        {/* Bind the server action to the form */}
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
              <CardDescription>Fill in the details to create your new event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display general form error message */}
              {state.errors?._form && <div className="text-sm font-medium text-destructive">{state.errors._form.join(", ")}</div>}

              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" placeholder="Enter event title" required />
                {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title.join(", ")}</p>}
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input id="event_date" name="event_date" type="date" required />
                {state.errors?.event_date && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.event_date.join(", ")} {/* Date/Time combo error shown here */}
                  </p>
                )}
              </div>

              {/* Event Time */}
              <div className="space-y-2">
                <Label htmlFor="event_time">Event Time</Label>
                <Input id="event_time" name="event_time" type="time" required />
                {/* Specific time error isn't separated in Zod schema, shown under Date */}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input id="location" name="location" placeholder="Enter event location" />
                {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location.join(", ")}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Provide details about your event" className="min-h-[120px]" />
                {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description.join(", ")}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              {/* Use the SubmitButton component */}
              <SubmitButton />
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
