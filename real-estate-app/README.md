# Interakt API Toolkit

A tiny Next.js dashboard for validating [Interakt](https://www.interakt.ai/) REST API keys and sending plain WhatsApp session messages without a template. The UI proxies your API requests through Next.js route handlers so you never expose your key in the browser console.

## Features

- **API key checker** – Calls Interakt's template listing endpoint with your key and surfaces the HTTP status and payload so you can confirm the key is live.
- **Plain message sender** – Submit a WhatsApp number, country code, and message body to fire a `type: "Plain"` request to Interakt's `/v1/public/message/` endpoint.
- **Detailed responses** – Inspect the raw JSON (or text) returned by Interakt for both verification and message sends.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the toolkit. All requests are executed server-side through Next.js route handlers located in `src/app/api/interakt`.

## Usage Notes

- Use your Interakt REST API key (the same string you pass as the `Authorization: Basic <key>` header).
- Regular/plain messages only reach customers who are within a valid 24-hour service window with your WhatsApp Business Account.
- The app does not persist any credentials or responses. Everything stays in memory per request.

## Scripts

| Command      | Description          |
| ------------ | -------------------- |
| `npm run dev`   | Start the local development server with Turbopack. |
| `npm run lint`  | Run ESLint. |
| `npm run build` | Build the production bundle. |

## Deployment

Deploy this app to any platform that supports Next.js 15+ (Vercel, Netlify, Docker, etc.). Ensure outbound HTTPS requests to `https://api.interakt.ai` are allowed from your hosting environment.
