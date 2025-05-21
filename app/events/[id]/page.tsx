"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { ShareOptions } from "@/app/components/ShareOptions";
import { ShareButton } from "@/app/components/ShareButton";
import { AddManualRsvpModal } from "@/app/components/AddManualRsvpModal";
import { APP_URL } from "@/lib/constants";
import { EditRsvpButtons } from "@/app/components/EditRsvpButtons";
import { EditEventModal } from "@/app/components/EditEventModal";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { fadeIn, fadeInScale, slideIn, textVariant } from "@/utils/animations";
import { rsvp_response } from "@prisma/client";

// Add a type for params
type EventPageParams = {
  params: {
    id: string;
  };
};

// Add a type for the RSVP data
type RsvpData = {
  id: string;
  name: string;
  email: string;
  response: rsvp_response;
  comment: string | null;
  created_at: Date | null;
  added_by_owner: boolean;
};

// Update the event data type
type EventWithDetails = {
  id: string;
  title: string;
  description: string | null;
  event_date: Date;
  user_id: string;
  created_at: Date | null;
  location: string | null;
  image_url?: string | null;
  rsvps: RsvpData[];
  rsvpCounts: {
    yes: number;
    no: number;
    maybe: number;
  };
};

// Make page component async and handle params properly
export default function EventDetailPage({ params }: EventPageParams) {
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventData() {
      try {
        setLoading(true);

        // Get authenticated user
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Fetch event data
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to load event");
        }

        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("Error loading event details");
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-muted-foreground">{error || "Event not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === event.user_id;
  const getRsvpsByType = (responseType: rsvp_response): RsvpData[] => event.rsvps.filter((rsvp: RsvpData) => rsvp.response === responseType);
  const eventUrl = `/events/${event.id}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="container flex h-16 items-center px-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>
      </header>

      <main className="container max-w-4xl px-4 py-6 md:py-10">
        <AnimatedSection variants={fadeIn("down", 0.2)}>
          {event.image_url ? (
            <motion.div className="mb-6 flex justify-center" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }}>
              <img src={event.image_url} alt="Event" className="rounded-lg w-1/2 max-w-2xl h-auto shadow" style={{ display: "block", margin: "0 auto" }} />
            </motion.div>
          ) : (
            <div className="mb-6 flex justify-center">
              <div className="rounded-lg bg-muted flex items-center justify-center max-h-80 w-full max-w-2xl h-60 text-muted-foreground text-lg">No event image</div>
            </div>
          )}
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3">
          <AnimatedSection className="md:col-span-2 space-y-6" variants={fadeIn("right", 0.3)}>
            <div>
              <motion.h1 variants={textVariant(0.1)} className="text-3xl font-bold tracking-tight">
                {event.title}
              </motion.h1>
              <motion.div variants={textVariant(0.2)} className="mt-2 flex flex-col gap-2 text-muted-foreground">
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
              </motion.div>
            </div>

            {event.description && (
              <motion.div variants={textVariant(0.3)}>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </motion.div>
            )}

            <motion.div variants={fadeInScale(0.4)} className="flex flex-wrap gap-3 place-content-evenly">
              <AnimatedButton asChild className="flex-1">
                <Link href={`${eventUrl}/rsvp`}>RSVP to Event</Link>
              </AnimatedButton>
              {!isOwner && (
                <AnimatedButton className="flex-1" asChild>
                  <ShareButton eventId={event.id} eventTitle={event.title} eventDate={new Date(event.event_date)} eventLocation={event.location || undefined} />
                </AnimatedButton>
              )}
              {isOwner && (
                <>
                  <EditEventModal event={{ ...event, image_url: event.image_url ?? undefined }} />
                  <AnimatedButton variant="outline" className="flex-1" asChild>
                    <AddManualRsvpModal eventId={event.id} />
                  </AnimatedButton>
                </>
              )}
            </motion.div>
          </AnimatedSection>

          <AnimatedSection className="space-y-6 md:col-span-1 my-auto" variants={fadeIn("left", 0.4)}>
            <AnimatedCard animate={false}>
              <CardHeader>
                <CardTitle>RSVP Stats</CardTitle>
                <CardDescription>Current response count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <motion.div className="flex justify-between" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <span>Yes</span>
                    <span className="font-medium text-green-600">{event.rsvpCounts.yes}</span>
                  </motion.div>
                  <motion.div className="flex justify-between" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <span>No</span>
                    <span className="font-medium text-red-600">{event.rsvpCounts.no}</span>
                  </motion.div>
                  <motion.div className="flex justify-between" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <span>Maybe</span>
                    <span className="font-medium text-amber-600">{event.rsvpCounts.maybe}</span>
                  </motion.div>
                  <motion.div className="flex justify-between pt-2 border-t mt-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{event.rsvpCounts.yes + event.rsvpCounts.no + event.rsvpCounts.maybe}</span>
                  </motion.div>
                </div>
              </CardContent>
            </AnimatedCard>
          </AnimatedSection>

          {isOwner && (
            <AnimatedSection className="mt-6 md:col-span-3" variants={fadeIn("up", 0.5)}>
              <ShareOptions eventId={event.id} eventTitle={event.title} eventDate={new Date(event.event_date)} eventLocation={event.location || undefined} eventDescription={event.description || undefined} />
            </AnimatedSection>
          )}
        </div>

        {isOwner && (
          <AnimatedSection className="mt-10 space-y-6" variants={fadeIn("up", 0.6)}>
            {/* Client component for edit buttons */}
            <EditRsvpButtons />

            <motion.h2 variants={textVariant(0.2)} className="text-2xl font-semibold tracking-tight border-b pb-2">
              Detailed RSVP Responses
            </motion.h2>

            <AnimatedSection staggerItems={true} staggerDelay={0.1}>
              <AnimatedItem variants={fadeInScale(0.2)} className="my-2">
                <AnimatedCard animate={false}>
                  <CardHeader>
                    <CardTitle className="text-green-600">Yes ({getRsvpsByType(rsvp_response.yes).length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getRsvpsByType(rsvp_response.yes).length > 0 ? (
                      <ul className="space-y-3">
                        {getRsvpsByType(rsvp_response.yes).map((rsvp, index) => (
                          <motion.li key={rsvp.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="border-b pb-3 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{rsvp.name}</p>
                              <div className="flex items-center gap-2">
                                {rsvp.added_by_owner && (
                                  <>
                                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                    <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                  </>
                                )}
                              </div>
                            </div>
                            {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                            <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No 'Yes' responses yet.</p>
                    )}
                  </CardContent>
                </AnimatedCard>
              </AnimatedItem>

              <AnimatedItem variants={fadeInScale(0.3)} className="mb-2">
                <AnimatedCard animate={false}>
                  <CardHeader>
                    <CardTitle className="text-amber-600">Maybe ({getRsvpsByType(rsvp_response.maybe).length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getRsvpsByType(rsvp_response.maybe).length > 0 ? (
                      <ul className="space-y-3">
                        {getRsvpsByType(rsvp_response.maybe).map((rsvp, index) => (
                          <motion.li key={rsvp.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="border-b pb-3 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{rsvp.name}</p>
                              <div className="flex items-center gap-2">
                                {rsvp.added_by_owner && (
                                  <>
                                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                    <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                  </>
                                )}
                              </div>
                            </div>
                            {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                            <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No 'Maybe' responses yet.</p>
                    )}
                  </CardContent>
                </AnimatedCard>
              </AnimatedItem>

              <AnimatedItem variants={fadeInScale(0.4)} className="mb-2">
                <AnimatedCard animate={false}>
                  <CardHeader>
                    <CardTitle className="text-red-600">No ({getRsvpsByType(rsvp_response.no).length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getRsvpsByType(rsvp_response.no).length > 0 ? (
                      <ul className="space-y-3">
                        {getRsvpsByType(rsvp_response.no).map((rsvp, index) => (
                          <motion.li key={rsvp.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="border-b pb-3 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{rsvp.name}</p>
                              <div className="flex items-center gap-2">
                                {rsvp.added_by_owner && (
                                  <>
                                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                    <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                  </>
                                )}
                              </div>
                            </div>
                            {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                            <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No 'No' responses yet.</p>
                    )}
                  </CardContent>
                </AnimatedCard>
              </AnimatedItem>
            </AnimatedSection>
          </AnimatedSection>
        )}
      </main>
    </div>
  );
}
