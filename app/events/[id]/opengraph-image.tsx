import { ImageResponse } from "next/og";
import { format } from "date-fns";
import prisma from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  // Get event data
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      event_date: true,
      location: true,
    },
  });

  if (!event) {
    // Fallback image if event not found
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "white",
            background: "linear-gradient(to bottom right, #4f46e5, #818cf8)",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 48,
          }}>
          <div style={{ fontWeight: 700 }}>Event Not Found</div>
          <div style={{ fontSize: 36, marginTop: 24 }}>RSVP App</div>
        </div>
      ),
      {
        ...size,
        status: 404,
      }
    );
  }

  // Format the date
  const formattedDate = format(new Date(event.event_date), "EEEE, MMMM d, yyyy");
  const formattedTime = format(new Date(event.event_date), "h:mm a");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "white",
          background: "linear-gradient(to bottom right, #4f46e5, #818cf8)",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          textAlign: "center",
        }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>{event.title}</div>
        <div style={{ fontSize: 36, marginTop: 12 }}>{formattedDate}</div>
        <div style={{ fontSize: 32, marginTop: 8 }}>{formattedTime}</div>
        {event.location && <div style={{ fontSize: 28, marginTop: 12, opacity: 0.9 }}>{event.location}</div>}
        <div style={{ fontSize: 24, marginTop: 36, opacity: 0.7 }}>RSVP Now</div>
      </div>
    ),
    size
  );
}
