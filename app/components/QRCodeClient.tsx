"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QRCodeClient() {
  useEffect(() => {
    // Find all QR code containers
    const containers = document.querySelectorAll("#qr-code-container");

    containers.forEach((container) => {
      const url = container.getAttribute("data-url");
      if (!url) return;

      // Use a simpler approach with an external QR code API
      container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}" alt="QR Code" />`;
    });
  }, []);

  return null;
}
