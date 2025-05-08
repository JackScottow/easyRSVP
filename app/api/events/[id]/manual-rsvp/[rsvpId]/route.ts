import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { rsvp_response } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Validation schema for the update request
const UpdateRsvpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  response: z.nativeEnum(rsvp_response, {
    errorMap: () => ({ message: "Please select a valid response (Yes, No, or Maybe)." }),
  }),
  comment: z.string().optional(),
});

// Helper function to check event ownership
async function checkEventOwnership(eventId: string, userId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { user_id: true },
  });

  if (!event) {
    return { error: "Event not found", status: 404 };
  }

  if (event.user_id !== userId) {
    return { error: "You are not authorized to modify RSVPs for this event", status: 403 };
  }

  return { success: true };
}

// Helper function to get RSVP and check if it exists
async function getRsvp(eventId: string, rsvpId: string) {
  const rsvp = await prisma.rsvp.findUnique({
    where: {
      id: rsvpId,
      event_id: eventId,
    },
  });

  if (!rsvp) {
    return { error: "RSVP not found", status: 404 };
  }

  return { success: true, rsvp };
}

// PUT endpoint to update an RSVP
export async function PUT(request: NextRequest, { params }: { params: { id: string; rsvpId: string } }) {
  try {
    // Get the event ID and RSVP ID from URL params
    const { id: eventId, rsvpId } = params;

    // Get the current user
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // Check if the user is the owner of this event
    const ownerCheck = await checkEventOwnership(eventId, user.id);
    if ("error" in ownerCheck) {
      return NextResponse.json({ message: ownerCheck.error }, { status: ownerCheck.status });
    }

    // Check if the RSVP exists
    const rsvpCheck = await getRsvp(eventId, rsvpId);
    if ("error" in rsvpCheck) {
      return NextResponse.json({ message: rsvpCheck.error }, { status: rsvpCheck.status });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = UpdateRsvpSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, response, comment } = validatedData.data;

    // Update the RSVP
    const updatedRsvp = await prisma.rsvp.update({
      where: { id: rsvpId },
      data: {
        name,
        email,
        response,
        comment,
      },
    });

    // Revalidate the event page to update the RSVP list
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ message: "RSVP updated successfully", rsvp: updatedRsvp }, { status: 200 });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return NextResponse.json({ message: "Failed to update RSVP" }, { status: 500 });
  }
}

// DELETE endpoint to remove an RSVP
export async function DELETE(_request: NextRequest, { params }: { params: { id: string; rsvpId: string } }) {
  try {
    // Get the event ID and RSVP ID from URL params
    const { id: eventId, rsvpId } = params;

    // Get the current user
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // Check if the user is the owner of this event
    const ownerCheck = await checkEventOwnership(eventId, user.id);
    if ("error" in ownerCheck) {
      return NextResponse.json({ message: ownerCheck.error }, { status: ownerCheck.status });
    }

    // Check if the RSVP exists
    const rsvpCheck = await getRsvp(eventId, rsvpId);
    if ("error" in rsvpCheck) {
      return NextResponse.json({ message: rsvpCheck.error }, { status: rsvpCheck.status });
    }

    // Delete the RSVP
    await prisma.rsvp.delete({
      where: { id: rsvpId },
    });

    // Revalidate the event page to update the RSVP list
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ message: "RSVP deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return NextResponse.json({ message: "Failed to delete RSVP" }, { status: 500 });
  }
}
