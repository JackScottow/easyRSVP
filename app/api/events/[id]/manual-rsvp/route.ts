import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { rsvp_response } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Validation schema for the request
const ManualRsvpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  response: z.nativeEnum(rsvp_response, {
    errorMap: () => ({ message: "Please select a valid response (Yes, No, or Maybe)." }),
  }),
  comment: z.string().optional(),
  added_by_owner: z.boolean().default(true),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the event ID from URL params
    const eventId = params.id;

    // Get the current user to verify ownership
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // Check if the user is the owner of this event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { user_id: true },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.user_id !== user.id) {
      return NextResponse.json({ message: "You are not authorized to add RSVPs to this event" }, { status: 403 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = ManualRsvpSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, response, comment, added_by_owner } = validatedData.data;

    // Check for duplicate RSVP by email
    const existingRsvp = await prisma.rsvp.findFirst({
      where: {
        event_id: eventId,
        email: email,
      },
    });

    if (existingRsvp) {
      return NextResponse.json({ message: "An RSVP with this email already exists for this event" }, { status: 409 });
    }

    // Create the new RSVP
    const newRsvp = await prisma.rsvp.create({
      data: {
        event_id: eventId,
        name,
        email,
        response,
        comment,
        added_by_owner,
      },
    });

    // Revalidate the event page to update the RSVP list
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ message: "RSVP added successfully", rsvp: newRsvp }, { status: 201 });
  } catch (error) {
    console.error("Error adding manual RSVP:", error);
    return NextResponse.json({ message: "Failed to add RSVP" }, { status: 500 });
  }
}
