"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { fadeIn, fadeInScale, slideIn, textVariant } from "@/utils/animations";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

type RsvpRecord = { event_id: string; response: "yes" | "no" | "maybe" };
type EventBase = {
  id: string;
  title: string;
  event_date: string;
  image_url?: string;
  location?: string | null;
  description?: string | null;
};
type Event = EventBase & {
  yesCount: number;
  noCount: number;
  maybeCount: number;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndEvents() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          window.location.href = "/login";
          return;
        }

        setUser(user);

        // Get events
        const { data: baseEvents, error: eventsError } = await supabase.from("events").select("id, title, event_date, image_url, location, description").eq("user_id", user.id).order("event_date", { ascending: false });

        if (eventsError) {
          setError("Error loading events");
          return;
        }

        const initialEvents = baseEvents || [];
        const eventIds = initialEvents.map((event: EventBase) => event.id);

        let rsvpCountsMap: { [eventId: string]: { yes: number; no: number; maybe: number } } = {};

        if (eventIds.length > 0) {
          const { data: rsvps, error: rsvpsError } = await supabase.from("rsvps").select("event_id, response").in("event_id", eventIds).in("response", ["yes", "no", "maybe"]);

          if (!rsvpsError && rsvps) {
            rsvpCountsMap = (rsvps as RsvpRecord[]).reduce((acc, rsvp) => {
              if (!acc[rsvp.event_id]) {
                acc[rsvp.event_id] = { yes: 0, no: 0, maybe: 0 };
              }
              if (rsvp.response === "yes") acc[rsvp.event_id].yes++;
              else if (rsvp.response === "no") acc[rsvp.event_id].no++;
              else if (rsvp.response === "maybe") acc[rsvp.event_id].maybe++;
              return acc;
            }, {} as typeof rsvpCountsMap);
          }
        }

        const eventsWithCounts: Event[] = initialEvents.map((event: EventBase) => {
          const counts = rsvpCountsMap[event.id] || { yes: 0, no: 0, maybe: 0 };
          return {
            ...event,
            yesCount: counts.yes,
            noCount: counts.no,
            maybeCount: counts.maybe,
          };
        });

        setEvents(eventsWithCounts);
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your events...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection className="container px-4 pt-2 md:pt-4 pb-6 md:pb-10">
        {/* User email display */}
        <motion.div variants={fadeIn("down", 0.2)} className="flex justify-end md:justify-end justify-center mb-4">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 shadow-sm border border-border max-w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" />
            </svg>
            <span className="truncate text-sm text-muted-foreground">
              Logged in as <span className="font-semibold text-foreground">{user?.email}</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <motion.h2 variants={textVariant(0.3)} className="text-2xl font-bold tracking-tight">
            Your Events
          </motion.h2>
          <AnimatedButton asChild>
            <Link href="/events/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </AnimatedButton>
        </div>

        {events.length === 0 ? (
          <AnimatedSection variants={fadeInScale(0.3)} className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <motion.h3 variants={textVariant(0.4)} className="mt-4 text-lg font-semibold">
              No events yet
            </motion.h3>
            <motion.p variants={textVariant(0.5)} className="mb-4 mt-2 text-sm text-muted-foreground">
              Create your first event to get started.
            </motion.p>
            <AnimatedButton animate={false} asChild>
              <Link href="/events/create">Create Event</Link>
            </AnimatedButton>
          </AnimatedSection>
        ) : (
          <AnimatedSection className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerItems={true} staggerDelay={0.08}>
            {events.map((event, index) => (
              <AnimatedItem key={event.id} variants={fadeInScale(0.1 * (index % 3))}>
                <Link href={`/events/${event.id}`} className="block">
                  <AnimatedCard animate={false} className="h-full transition-all hover:shadow-md overflow-hidden">
                    <div className="relative">
                      {event.image_url ? (
                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-muted/60 flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                      <div className="mt-1 flex items-center text-xs text-muted-foreground truncate" title={event.location || undefined}>
                        {event.location ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Date not set"}
                      </div>
                      <div className="mt-2 min-h-[48px] text-xs text-muted-foreground line-clamp-2" title={event.description || undefined}>
                        {event.description ? event.description : <span>&nbsp;</span>}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between w-full text-sm bg-muted/30 py-2 px-3 rounded-md mt-2">
                        <span className="flex items-center gap-1 mx-auto text-green-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          {event.yesCount} Yes
                        </span>
                        <span className="flex items-center gap-1 mx-auto text-red-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          {event.noCount} No
                        </span>
                        <span className="flex items-center gap-1 mx-auto text-amber-600 font-medium">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          {event.maybeCount} Maybe
                        </span>
                      </div>
                    </CardFooter>
                  </AnimatedCard>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        )}
      </AnimatedSection>
    </div>
  );
}
