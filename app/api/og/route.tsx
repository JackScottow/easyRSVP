import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get title and date from the request
    const title = searchParams.get("title") || "Event Invitation";
    const date = searchParams.get("date") || "Join us!";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            backgroundImage: "linear-gradient(to bottom right, #f0f0f0, #ffffff)",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              padding: "40px",
              margin: "20px",
              maxWidth: "80%",
            }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ff6b00",
                }}>
                RSVP App
              </span>
            </div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#333",
                marginBottom: "10px",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}>
              {title}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "normal",
                color: "#666",
                marginBottom: "20px",
                textAlign: "center",
              }}>
              {date}
            </div>
            <div
              style={{
                backgroundColor: "#ff6b00",
                color: "white",
                padding: "12px 24px",
                borderRadius: "50px",
                fontSize: "24px",
                fontWeight: "bold",
              }}>
              RSVP Now
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`Error generating image: ${e}`);
    return new Response(`Error generating image`, {
      status: 500,
    });
  }
}
