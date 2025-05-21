import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rsvp_response } from "@prisma/client";

// Schema for validating RSVP submissions
const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().default(""),
  response: z.enum([rsvp_response.yes, rsvp_response.no, rsvp_response.maybe], {
    errorMap: () => ({ message: "Valid response is required (yes, no, maybe)" }),
  }),
  comment: z.string().optional().nullable(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const body = await request.json();

    // Validate request body
    const validationResult = rsvpSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map((err) => err.message).join(", ");

      return new NextResponse(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { name, email, response, comment } = validationResult.data;

    // Verify that event exists
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!eventExists) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Create the RSVP in the database
    const rsvp = await prisma.rsvp.create({
      data: {
        name,
        email: email || "",
        response,
        comment: comment || null,
        event_id: eventId,
        added_by_owner: false,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "RSVP submitted successfully",
        rsvp,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing RSVP submission:", error);
    return new NextResponse(JSON.stringify({ error: "An error occurred while processing your request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
