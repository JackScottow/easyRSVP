import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";
import { rsvp_response } from "@prisma/client";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { ShareOptions } from "@/app/components/ShareOptions";
import { ShareButton } from "@/app/components/ShareButton";
import { AddManualRsvpModal } from "@/app/components/AddManualRsvpModal";
import { APP_URL } from "@/lib/constants";
import { EditRsvpButtons } from "@/app/components/EditRsvpButtons";

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
  rsvps: RsvpData[];
  rsvpCounts: {
    yes: number;
    no: number;
    maybe: number;
  };
};

// Function to fetch event data
async function getEventData(id: string): Promise<EventWithDetails> {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        rsvps: {
          select: {
            id: true,
            name: true,
            email: true,
            response: true,
            comment: true,
            created_at: true,
            added_by_owner: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!event) {
      notFound();
    }

    // Calculate RSVP counts
    const rsvpCounts = event.rsvps.reduce(
      (acc: { yes: number; no: number; maybe: number }, rsvp) => {
        if (rsvp.response === rsvp_response.yes) acc.yes++;
        else if (rsvp.response === rsvp_response.no) acc.no++;
        else if (rsvp.response === rsvp_response.maybe) acc.maybe++;
        return acc;
      },
      { yes: 0, no: 0, maybe: 0 }
    );

    return { ...event, rsvpCounts } as EventWithDetails;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    notFound();
  }
}

// Generate metadata for the page to properly handle the dynamic params
export async function generateMetadata({ params }: EventPageParams) {
  try {
    const event = await getEventData(params.id);
    const eventUrl = `${APP_URL}/events/${event.id}`;
    const rsvpUrl = `${eventUrl}/rsvp`;

    return {
      title: event.title,
      description: event.description || `RSVP for ${event.title}`,
      openGraph: {
        title: `RSVP for ${event.title}`,
        description: event.description || `RSVP for ${event.title}`,
        type: "website",
        url: rsvpUrl,
        siteName: "RSVP App",
        images: [
          {
            url: `${APP_URL}/api/og?title=${encodeURIComponent(event.title)}&date=${encodeURIComponent(format(new Date(event.event_date), "EEEE, MMMM d, yyyy"))}`,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `RSVP for ${event.title}`,
        description: event.description || `RSVP for ${event.title}`,
        images: [`${APP_URL}/api/og?title=${encodeURIComponent(event.title)}&date=${encodeURIComponent(format(new Date(event.event_date), "EEEE, MMMM d, yyyy"))}`],
      },
    };
  } catch (error) {
    return {
      title: "Event Details",
      description: "View event details and RSVP",
    };
  }
}

// Make page component async and handle params properly
export default async function EventDetailPage({ params }: EventPageParams) {
  // Make sure to await all async operations
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the event data using the ID from params
  const event = await getEventData(params.id);

  const isOwner = user?.id === event.user_id;

  // Update the type for getRsvpsByType to specify return type
  const getRsvpsByType = (responseType: rsvp_response): RsvpData[] => event.rsvps.filter((rsvp: RsvpData) => rsvp.response === responseType);

  // Store the event ID for use in links
  const eventUrl = `/events/${event.id}`;

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

      <main className="container max-w-4xl px-4 py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6   ">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <div className="mt-2 flex flex-col gap-2 text-muted-foreground">
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
            </div>

            {event.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 place-content-evenly">
              <Button asChild className="flex-1">
                <Link href={`${eventUrl}/rsvp`}>RSVP to Event</Link>
              </Button>
              {!isOwner && (
                <Button className="flex-1" asChild>
                  <ShareButton eventId={event.id} eventTitle={event.title} eventDate={new Date(event.event_date)} eventLocation={event.location || undefined} />
                </Button>
              )}
              {isOwner && (
                <>
                  <Button variant="secondary" className="flex-1">
                    Manage Event
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <AddManualRsvpModal eventId={event.id} />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6 md:col-span-1 my-auto">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Stats</CardTitle>
                <CardDescription>Current response count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Yes</span>
                    <span className="font-medium text-green-600">{event.rsvpCounts.yes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No</span>
                    <span className="font-medium text-red-600">{event.rsvpCounts.no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maybe</span>
                    <span className="font-medium text-amber-600">{event.rsvpCounts.maybe}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">{event.rsvpCounts.yes + event.rsvpCounts.no + event.rsvpCounts.maybe}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {isOwner && (
            <div className="mt-6 md:col-span-3">
              <ShareOptions eventId={event.id} eventTitle={event.title} eventDate={new Date(event.event_date)} eventLocation={event.location || undefined} eventDescription={event.description || undefined} />
            </div>
          )}
        </div>

        {isOwner && (
          <>
            {/* Client component for edit buttons */}
            <EditRsvpButtons />

            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Detailed RSVP Responses</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Yes ({getRsvpsByType(rsvp_response.yes).length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {getRsvpsByType(rsvp_response.yes).length > 0 ? (
                    <ul className="space-y-3">
                      {getRsvpsByType(rsvp_response.yes).map((rsvp) => (
                        <li key={rsvp.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{rsvp.name}</p>
                            <div className="flex items-center gap-2">
                              {rsvp.added_by_owner && (
                                <>
                                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                  {/* Edit button will be added client-side */}
                                  <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                </>
                              )}
                            </div>
                          </div>
                          {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                          <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No 'Yes' responses yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-600">Maybe ({getRsvpsByType(rsvp_response.maybe).length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {getRsvpsByType(rsvp_response.maybe).length > 0 ? (
                    <ul className="space-y-3">
                      {getRsvpsByType(rsvp_response.maybe).map((rsvp) => (
                        <li key={rsvp.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{rsvp.name}</p>
                            <div className="flex items-center gap-2">
                              {rsvp.added_by_owner && (
                                <>
                                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                  {/* Edit button will be added client-side */}
                                  <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                </>
                              )}
                            </div>
                          </div>
                          {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                          <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No 'Maybe' responses yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">No ({getRsvpsByType(rsvp_response.no).length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {getRsvpsByType(rsvp_response.no).length > 0 ? (
                    <ul className="space-y-3">
                      {getRsvpsByType(rsvp_response.no).map((rsvp) => (
                        <li key={rsvp.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{rsvp.name}</p>
                            <div className="flex items-center gap-2">
                              {rsvp.added_by_owner && (
                                <>
                                  <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1">Added by you</span>
                                  {/* Edit button will be added client-side */}
                                  <div id={`edit-button-${rsvp.id}`} data-rsvp-id={rsvp.id} data-rsvp-name={rsvp.name} data-rsvp-email={rsvp.email || ""} data-rsvp-response={rsvp.response} data-rsvp-comment={rsvp.comment || ""} data-event-id={event.id} className="edit-rsvp-placeholder"></div>
                                </>
                              )}
                            </div>
                          </div>
                          {rsvp.comment && <p className="text-sm text-muted-foreground mt-1 italic">"{rsvp.comment}"</p>}
                          <p className="text-xs text-muted-foreground mt-1">{rsvp.created_at ? format(new Date(rsvp.created_at), "PPpp") : "Date not available"}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No 'No' responses yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
