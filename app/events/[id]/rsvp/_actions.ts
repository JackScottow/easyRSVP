"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { rsvp_response } from "@prisma/client";
import prisma from "@/lib/prisma";

const RsvpSchema = z.object({
  eventId: z.string().uuid("Invalid event ID."),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  response: z.nativeEnum(rsvp_response, {
    errorMap: () => ({ message: "Please select a response (Yes, No, or Maybe)." }),
  }),
  comment: z.string().optional(),
});

export type RsvpFormState = {
  message: string | null;
  success: boolean;
  errors?: {
    eventId?: string[];
    name?: string[];
    email?: string[];
    response?: string[];
    comment?: string[];
    _form?: string[];
  };
};

export async function submitRsvpAction(prevState: RsvpFormState, formData: FormData): Promise<RsvpFormState> {
  const validatedFields = RsvpSchema.safeParse({
    eventId: formData.get("eventId"),
    name: formData.get("name"),
    email: formData.get("email"),
    response: formData.get("response"),
    comment: formData.get("comment"),
  });

  if (!validatedFields.success) {
    console.error("RSVP Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check the fields below.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { eventId, name, email, response, comment } = validatedFields.data;

  try {
    const existingRsvp = await prisma.rsvp.findFirst({
      where: {
        event_id: eventId,
        email: email,
      },
    });

    if (existingRsvp) {
      return {
        message: "It looks like you've already RSVP'd for this event with this email address.",
        errors: { _form: ["Duplicate RSVP detected."] },
        success: false,
      };
    }

    await prisma.rsvp.create({
      data: {
        event_id: eventId,
        name: name,
        email: email,
        response: response,
        comment: comment,
      },
    });
  } catch (error) {
    console.error("Database Error (RSVP):", error);
    return {
      message: "Database Error: Failed to save your RSVP. Please try again.",
      errors: { _form: ["Database error occurred."] },
      success: false,
    };
  }

  revalidatePath(`/events/${eventId}`);

  return { message: "RSVP submitted successfully!", success: true, errors: {} };
}
