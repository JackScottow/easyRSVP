"use client"; // Form interaction requires client component

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
// import { rsvp_response } from "@prisma/client"; // Import enum for form values

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, MapPin, ThumbsDown, ThumbsUp, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Import the server action and state type
import { submitRsvpAction, type RsvpFormState } from "./_actions";

// Define a local enum to match the server-side rsvp_response
export enum rsvp_response {
  yes = "yes",
  no = "no",
  maybe = "maybe",
}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" aria-disabled={pending} disabled={pending}>
      {pending ? "Submitting..." : "Submit RSVP"}
    </Button>
  );
}

// Define props for the form component
interface RsvpFormProps {
  event: {
    title: string;
    event_date: Date;
    location: string | null;
  };
  eventId: string;
}

// Form component
export function RsvpForm({ event, eventId }: RsvpFormProps) {
  const { toast } = useToast();
  const [hasAlreadyRsvpd, setHasAlreadyRsvpd] = useState(false);
  const localStorageKey = `rsvpSubmitted-${eventId}`;

  const initialState: RsvpFormState = {
    message: null,
    errors: {},
    success: false,
  };

  const [state, formAction] = useFormState(submitRsvpAction, initialState);

  // Show toast message on error (success is handled by showing Thank You message)
  useEffect(() => {
    if (state.message && !state.success) {
      toast({ title: "Error", description: state.message, variant: "destructive" });
    }
  }, [state, toast]);

  // Check localStorage on mount
  useEffect(() => {
    if (localStorage.getItem(localStorageKey)) {
      setHasAlreadyRsvpd(true);
    }
  }, [localStorageKey]);

  // Set localStorage on successful submission
  useEffect(() => {
    if (state.success) {
      localStorage.setItem(localStorageKey, "true");
      setHasAlreadyRsvpd(true);
    }
  }, [state.success, localStorageKey]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-lg px-4 py-6 md:py-10">
        <Card className="mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription>
              <div className="mt-2 flex flex-col items-center gap-1 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(new Date(event.event_date), "h:mm a")}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show Thank You message on success OR if already RSVP'd via localStorage */}
            {state.success || hasAlreadyRsvpd ? (
              <div className="py-6 text-center space-y-4">
                <div className="text-2xl font-semibold">Thank you!</div>
                <p>{state.message || "You have already RSVP'd for this event."}</p>
                <Button asChild className="mt-4">
                  <Link href={`/events/${eventId}`}>View Event Details</Link>
                </Button>
              </div>
            ) : (
              /* Bind form action */
              <form action={formAction} className="space-y-6">
                {/* Hidden input for event ID */}
                <input type="hidden" name="eventId" value={eventId} />

                {/* Display general form error */}
                {state.errors?._form && <p className="text-sm font-medium text-destructive">{state.errors._form.join(", ")}</p>}

                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name" // Add name attribute
                    placeholder="Enter your full name"
                    required
                    aria-describedby="name-error"
                  />
                  {state.errors?.name && (
                    <p id="name-error" className="text-sm font-medium text-destructive">
                      {state.errors.name.join(", ")}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    name="email" // Add name attribute
                    type="email" // Set input type to email
                    placeholder="Enter your email address"
                    required
                    aria-describedby="email-error"
                  />
                  {state.errors?.email && (
                    <p id="email-error" className="text-sm font-medium text-destructive">
                      {state.errors.email.join(", ")}
                    </p>
                  )}
                </div>

                {/* Response Radio Group */}
                <div className="space-y-2">
                  <Label>Will you attend?</Label>
                  <RadioGroup name="response" aria-describedby="response-error">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={rsvp_response.yes} id="rsvp-yes" />
                      <Label htmlFor="rsvp-yes" className="flex items-center gap-2 font-normal cursor-pointer">
                        <ThumbsUp className="h-4 w-4" /> Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={rsvp_response.no} id="rsvp-no" />
                      <Label htmlFor="rsvp-no" className="flex items-center gap-2 font-normal cursor-pointer">
                        <ThumbsDown className="h-4 w-4" /> No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={rsvp_response.maybe} id="rsvp-maybe" />
                      <Label htmlFor="rsvp-maybe" className="flex items-center gap-2 font-normal cursor-pointer">
                        <HelpCircle className="h-4 w-4" /> Maybe
                      </Label>
                    </div>
                  </RadioGroup>
                  {state.errors?.response && (
                    <p id="response-error" className="text-sm font-medium text-destructive">
                      {state.errors.response.join(", ")}
                    </p>
                  )}
                </div>

                {/* Optional Comment Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    name="comment" // Add name attribute
                    placeholder="Add any comments (e.g., dietary restrictions)"
                    aria-describedby="comment-error"
                  />
                  {state.errors?.comment && (
                    <p id="comment-error" className="text-sm font-medium text-destructive">
                      {state.errors.comment.join(", ")}
                    </p>
                  )}
                </div>

                <SubmitButton />
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
