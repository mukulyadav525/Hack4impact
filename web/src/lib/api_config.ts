let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let apiBaseUrl: string;
let apiV1: string;

// Handle relative paths for proxying (e.g., /api/v1)
if (rawBaseUrl.startsWith("/")) {
  apiBaseUrl = "";
  apiV1 = rawBaseUrl;
} else {
  // Ensure it has a protocol (prevents invalid relative requests on Vercel)
  if (!rawBaseUrl.startsWith("http://") && !rawBaseUrl.startsWith("https://")) {
    rawBaseUrl = `https://${rawBaseUrl}`;
  }

  // Force HTTPS for non-localhost URLs to prevent Mixed Content errors on Vercel
  apiBaseUrl = rawBaseUrl.includes("localhost") ? rawBaseUrl : rawBaseUrl.replace("http://", "https://");
  apiV1 = `${apiBaseUrl}/api/v1`;
}

export const API_BASE_URL = apiBaseUrl;
export const API_V1 = apiV1;
