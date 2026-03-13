let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Ensure it has a protocol (prevents invalid relative requests on Vercel)
if (!rawBaseUrl.startsWith("http://") && !rawBaseUrl.startsWith("https://")) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}

// Force HTTPS for non-localhost URLs to prevent Mixed Content errors on Vercel
export const API_BASE_URL = rawBaseUrl.includes("localhost") ? rawBaseUrl : rawBaseUrl.replace("http://", "https://");
export const API_V1 = `${API_BASE_URL}/api/v1`;
