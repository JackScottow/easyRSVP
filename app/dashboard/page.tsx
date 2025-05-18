import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RsvpRecord = { event_id: string; response: "yes" | "no" | "maybe" };
type Event = {
  id: string;
  title: string;
  event_date: string;
  yesCount: number;
  noCount: number;
  maybeCount: number;
  image_url?: string;
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: baseEvents, error: eventsError } = await supabase.from("events").select("id, title, event_date, image_url").eq("user_id", user.id).order("event_date", { ascending: false });

  if (eventsError) {
    console.error("Error fetching events (handled):", eventsError.message);

    return <div>Error loading events.</div>;
  }

  const initialEvents = baseEvents || [];
  const eventIds = initialEvents.map((event) => event.id);

  let rsvpCountsMap: { [eventId: string]: { yes: number; no: number; maybe: number } } = {};

  if (eventIds.length > 0) {
    const { data: rsvps, error: rsvpsError } = await supabase.from("rsvps").select("event_id, response").in("event_id", eventIds).in("response", ["yes", "no", "maybe"]);

    if (rsvpsError) {
      console.error("Error fetching RSVPs (handled):", rsvpsError.message);
    } else if (rsvps) {
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

  const eventsWithCounts: Event[] = initialEvents.map((event) => {
    const counts = rsvpCountsMap[event.id] || { yes: 0, no: 0, maybe: 0 };
    return {
      ...event,
      yesCount: counts.yes,
      noCount: counts.no,
      maybeCount: counts.maybe,
    };
  });

  const fetchedEvents: Event[] = eventsWithCounts;

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 pt-2 md:pt-4 pb-6 md:pb-10">
        {/* User email display */}
        <div className="flex justify-end md:justify-end justify-center mb-4">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 shadow-sm border border-border max-w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" />
            </svg>
            <span className="truncate text-sm text-muted-foreground">
              Logged in as <span className="font-semibold text-foreground">{user.email}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Events</h2>
          <Button asChild>
            <Link href="/events/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {fetchedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Create your first event to get started.</p>
            <Button asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fetchedEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    {event.image_url ? <img src={event.image_url} alt="Event" className="rounded mb-2 mx-auto max-h-60 max-w-lg w-auto h-auto" style={{ display: "block" }} /> : <div className="rounded bg-muted flex items-center justify-center mb-2 max-h-32 w-full h-24 text-muted-foreground text-sm">No image</div>}
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date not set"}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-evenly w-full text-sm">
                      <span className="text-green-600">{event.yesCount} Yes</span>
                      <span className="text-red-600">{event.noCount} No</span>
                      <span className="text-amber-600">{event.maybeCount} Maybe</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
