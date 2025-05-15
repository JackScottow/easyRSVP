"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server"; // Use the refactored server client
import prisma from "@/lib/prisma";

// Define the schema for form validation using Zod
const CreateEventSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    description: z.string().optional(),
    location: z.string().optional(), // Add optional location
    // Combine date and time strings, then refine to ensure it's a valid date
    event_date: z.string().min(1, "Date is required."),
    event_time: z.string().min(1, "Time is required."),
    image_url: z.string().optional(), // Add image_url to schema
  })
  .refine(
    (data) => {
      const dateTimeString = `${data.event_date}T${data.event_time}`;
      const date = new Date(dateTimeString);
      return !isNaN(date.getTime());
    },
    {
      message: "Invalid date or time format.", // Changed error message slightly
      path: ["event_date"], // Attach error to date field, but it implies time too
    }
  );

// Define the state for the form action
export type CreateEventFormState = {
  message: string | null;
  errors?: {
    title?: string[];
    description?: string[];
    location?: string[]; // Add location errors
    event_date?: string[]; // Includes time validation error
    image_url?: string[]; // Add image_url errors
    _form?: string[]; // General form errors
  };
  success: boolean;
};

export async function createEventAction(prevState: CreateEventFormState, formData: FormData): Promise<CreateEventFormState> {
  // 1. Get Supabase client and user
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore); // Pass resolved cookie store
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Authentication required. Please log in.", // Clearer message
      errors: { _form: ["Authentication required."] },
      success: false,
    };
  }

  // 2. Validate form data
  const validatedFields = CreateEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"), // Get location from form data
    event_date: formData.get("event_date"),
    event_time: formData.get("event_time"),
    image_url: formData.get("image_url"), // Get image_url from form data
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the fields below.", // Clearer message
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // 3. Combine date and time and create event
  const { title, description, location, event_date, event_time, image_url } = validatedFields.data;
  const eventDateTime = new Date(`${event_date}T${event_time}`);

  try {
    await prisma.event.create({
      data: {
        title: title,
        description: description,
        location: location, // Add location to create data
        event_date: eventDateTime,
        user_id: user.id, // Associate with logged-in user
        image_url: image_url || null, // Save image_url if provided
      },
    });
  } catch (error) {
    // Consider more specific error handling if needed
    return {
      message: "Database Error: Failed to create event. Please try again.",
      errors: { _form: ["Database error occurred."] },
      success: false,
    };
  }

  // 4. Revalidate path and signal success (or redirect)
  revalidatePath("/dashboard"); // Assuming events are shown on dashboard
  revalidatePath("/events/create"); // Revalidate the create page itself

  // Option 1: Redirect immediately (user won't see success message on this page)
  // redirect("/dashboard");

  // Option 2: Return success state to show message on the form page
  return { message: "Event created successfully!", success: true, errors: {} };
}
