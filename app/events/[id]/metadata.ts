import { Metadata } from "next";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { APP_URL } from "@/lib/constants";
import { rsvp_response } from "@prisma/client";

// Type for params
type EventPageParams = {
  params: {
    id: string;
  };
};

// Function to get event data for metadata
async function getEventData(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        description: true,
        event_date: true,
      },
    });

    if (!event) {
      return null;
    }

    return event;
  } catch (error) {
    console.error("Failed to fetch event for metadata:", error);
    return null;
  }
}

// Generate metadata for the page to properly handle the dynamic params
export async function generateMetadata({ params }: EventPageParams): Promise<Metadata> {
  const event = await getEventData(params.id);

  if (!event) {
    return {
      title: "Event Details",
      description: "View event details and RSVP",
    };
  }

  const eventUrl = `${APP_URL}/events/${event.id}`;
  const rsvpUrl = `${eventUrl}/rsvp`;
  const formattedDate = format(new Date(event.event_date), "EEEE, MMMM d, yyyy");

  return {
    title: event.title,
    description: event.description || `RSVP for ${event.title}`,
    openGraph: {
      title: `RSVP for ${event.title}`,
      description: event.description || `RSVP for ${event.title}`,
      type: "website",
      url: rsvpUrl,
      siteName: "RSVP App",
    },
    twitter: {
      card: "summary_large_image",
      title: `RSVP for ${event.title}`,
      description: event.description || `RSVP for ${event.title}`,
    },
  };
}
