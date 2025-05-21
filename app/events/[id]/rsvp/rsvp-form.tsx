"use client"; // Form interaction requires client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { fadeIn, fadeInScale, slideIn, textVariant } from "@/utils/animations";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { rsvp_response } from "@prisma/client";
import { toast } from "sonner";

interface EventData {
  title: string;
  event_date: string | Date;
  location: string | null;
  image_url?: string | null;
}

interface RsvpFormProps {
  event: EventData;
  eventId: string;
}

export function RsvpForm({ event, eventId }: RsvpFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState<"yes" | "no" | "maybe" | "">("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !response) {
      setError("Name and response are required");
      setLoading(false);
      return;
    }

    try {
      // Submit the form data
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          response,
          comment: comment || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit RSVP");
      }

      // Show success message and redirect
      toast.success("RSVP submitted successfully!");

      // Redirect to event page
      router.push(`/events/${eventId}?rsvp=success`);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your RSVP");
      console.error("RSVP submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="container flex h-16 items-center px-4">
          <Link href={`/events/${eventId}`} className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>
        </motion.div>
      </header>

      <main className="container max-w-xl px-4 py-8 md:py-12">
        <AnimatedSection className="mb-8">
          <motion.h1 variants={textVariant(0.1)} className="text-3xl font-bold tracking-tight text-center mb-4">
            RSVP for {event.title}
          </motion.h1>

          <motion.div variants={fadeInScale(0.2)} className="text-center mb-6 text-muted-foreground">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="mr-2 h-4 w-4" />
              {typeof event.event_date === "string" ? format(new Date(event.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a") : format(event.event_date, "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </div>
            {event.location && (
              <div className="flex items-center justify-center">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location}
              </div>
            )}
          </motion.div>

          {event.image_url && (
            <motion.div className="mb-6 flex justify-center" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
              <img src={event.image_url} alt="Event" className="rounded-lg max-w-full h-auto shadow max-h-60" style={{ display: "block" }} />
            </motion.div>
          )}
        </AnimatedSection>

        <AnimatedCard className="w-full" animate={false}>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
              <CardDescription>Please fill out the details below to RSVP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-3 rounded-md bg-red-50 text-red-600 text-sm">
                  {error}
                </motion.div>
              )}

              <motion.div variants={fadeIn("right", 0.1)}>
                <Label htmlFor="name" className="text-muted-foreground mb-1.5 block">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </motion.div>

              <motion.div variants={fadeIn("right", 0.2)}>
                <Label htmlFor="email" className="text-muted-foreground mb-1.5 block">
                  Email (optional)
                </Label>
                <Input id="email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </motion.div>

              <motion.div variants={fadeIn("right", 0.3)}>
                <Label className="text-muted-foreground mb-1.5 block">
                  Will you attend? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={response} onValueChange={(value) => setResponse(value as any)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="text-green-600 font-medium">
                      Yes, I'll be there
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="text-red-600 font-medium">
                      No, I can't make it
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="maybe" />
                    <Label htmlFor="maybe" className="text-amber-600 font-medium">
                      Maybe, I'm not sure yet
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>

              <motion.div variants={fadeIn("right", 0.4)}>
                <Label htmlFor="comment" className="text-muted-foreground mb-1.5 block">
                  Comment (optional)
                </Label>
                <Textarea id="comment" placeholder="Add a comment or message for the host" value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-[100px]" />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button variant="outline" type="button" onClick={() => router.push(`/events/${eventId}`)}>
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit RSVP"}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </AnimatedCard>
      </main>
    </div>
  );
}
