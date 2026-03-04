// Shared API base URL — reads from environment variable in production,
// falls back to empty string (relative URL) which works via Vite proxy in dev
// and works natively when frontend & backend are on the same server in production.
export const API_BASE = "https://api.acet-sports.favoflex.com";
