import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
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
    const { title, description, event_date, location } = body;

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        event_date: new Date(event_date),
        location,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
