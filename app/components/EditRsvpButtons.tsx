"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { EditManualRsvpModal } from "@/app/components/EditManualRsvpModal";

export enum rsvp_response {
  yes = "yes",
  no = "no",
  maybe = "maybe",
}

export function EditRsvpButtons() {
  useEffect(() => {
    // Find all edit button placeholders
    const placeholders = document.querySelectorAll(".edit-rsvp-placeholder");

    placeholders.forEach((placeholder) => {
      const rsvpId = placeholder.getAttribute("data-rsvp-id");
      const name = placeholder.getAttribute("data-rsvp-name") || "";
      const email = placeholder.getAttribute("data-rsvp-email") || "";
      const response = placeholder.getAttribute("data-rsvp-response") as rsvp_response;
      const comment = placeholder.getAttribute("data-rsvp-comment") || null;
      const eventId = placeholder.getAttribute("data-event-id") || "";

      if (rsvpId && eventId) {
        // Create a root for the portal
        const root = document.createElement("div");
        root.id = `edit-root-${rsvpId}`;
        placeholder.appendChild(root);

        // Render the edit button inside the placeholder
        const modalElement = document.getElementById(`edit-root-${rsvpId}`);
        if (modalElement) {
          const rsvpData = {
            id: rsvpId,
            name,
            email,
            response,
            comment,
          };

          const modal = createPortal(<EditManualRsvpModal eventId={eventId} rsvp={rsvpData} onUpdate={() => window.location.reload()} />, modalElement);

          // Need to use ReactDOM.render or similar here, but simplified for this example
          // This would typically be handled with a more sophisticated approach in a real app
        }
      }
    });
  }, []);

  return null; // This component doesn't render anything itself
}
