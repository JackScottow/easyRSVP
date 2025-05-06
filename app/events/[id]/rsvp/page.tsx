// Fetch event data server-side for initial display
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
// Remove enum import, it's only needed in client component now
// import { rsvp_response } from "@prisma/client";

// Import the client component
import { RsvpForm } from "./rsvp-form";

async function getEventForRsvp(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { title: true, event_date: true, location: true }, // Select only needed fields
    });
    if (!event) notFound();
    return event;
  } catch (error) {
    console.error("Failed to fetch event for RSVP page:", error);
    notFound();
  }
}

// Make the default export async to fetch data
export default async function RsvpPage({ params }: { params: { id: string } }) {
  // Fetch data on the server
  const event = await getEventForRsvp(params.id);

  // Render the client component, passing data as props
  return <RsvpForm event={event} eventId={params.id} />;
}

// --- Client Component for the Form ---
// All the client-side logic previously here is now moved to rsvp-form.tsx
