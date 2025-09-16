import { NextResponse } from "next/server";

type VerifyRequestBody = {
  apiKey?: string;
};

const INTERAKT_TEMPLATES_ENDPOINT =
  "https://api.interakt.ai/v1/public/templates/?page=1&limit=1";

export async function POST(request: Request) {
  let body: VerifyRequestBody;

  try {
    body = (await request.json()) as VerifyRequestBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        status: 400,
        message: "Request body must be valid JSON.",
      },
      { status: 400 }
    );
  }

  const apiKey = body.apiKey?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        status: 400,
        message: "An Interakt API key is required for verification.",
      },
      { status: 400 }
    );
  }

  try {
    const interaktResponse = await fetch(INTERAKT_TEMPLATES_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const rawBody = await interaktResponse.text();
    let parsedBody: unknown = null;
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }
    }

    if (!interaktResponse.ok) {
      const errorMessage =
        typeof parsedBody === "object" && parsedBody !== null && "message" in parsedBody
          ? String((parsedBody as { message: unknown }).message)
          : "Interakt rejected the API key.";

      return NextResponse.json(
        {
          ok: false,
          status: interaktResponse.status,
          message: errorMessage,
          details: parsedBody,
        },
        { status: interaktResponse.status }
      );
    }

    let message = "Interakt accepted the request.";
    if (typeof parsedBody === "object" && parsedBody !== null) {
      if ("message" in parsedBody) {
        message = String((parsedBody as { message: unknown }).message);
      } else if ("data" in parsedBody) {
        message = "API key verified successfully.";
      }
    }

    return NextResponse.json(
      {
        ok: true,
        status: interaktResponse.status,
        message,
        details: parsedBody,
      },
      { status: interaktResponse.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while contacting Interakt.",
      },
      { status: 500 }
    );
  }
}
