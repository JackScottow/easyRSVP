import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { rsvp_response } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event.user_id !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { title, description, event_date, location, image_url } = body;

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        event_date: new Date(event_date),
        location,
        image_url: image_url || null,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Function to fetch event data
async function getEventData(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        description: true,
        event_date: true,
        user_id: true,
        created_at: true,
        location: true,
        image_url: true,
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
      return null;
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

    return { ...event, rsvpCounts };
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventData = await getEventData(params.id);

    if (!eventData) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(eventData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in event API route:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
