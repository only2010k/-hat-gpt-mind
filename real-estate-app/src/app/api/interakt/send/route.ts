import { NextResponse } from "next/server";

type SendRequestBody = {
  apiKey?: string;
  countryCode?: string;
  phoneNumber?: string;
  message?: string;
};

const INTERAKT_MESSAGE_ENDPOINT = "https://api.interakt.ai/v1/public/message/";

export async function POST(request: Request) {
  let body: SendRequestBody;

  try {
    body = (await request.json()) as SendRequestBody;
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
  const countryCode = body.countryCode?.trim() || "+91";
  const phoneNumber = body.phoneNumber?.trim();
  const message = body.message?.trim();

  if (!apiKey || !phoneNumber || !message) {
    return NextResponse.json(
      {
        ok: false,
        status: 400,
        message:
          "API key, phone number, and message text are required to send a message.",
      },
      { status: 400 }
    );
  }

  try {
    const interaktResponse = await fetch(INTERAKT_MESSAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        countryCode,
        phoneNumber,
        type: "Plain",
        message: {
          text: message,
        },
      }),
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
          : "Interakt rejected the message payload.";

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

    let messageText = "Message accepted by Interakt.";
    if (typeof parsedBody === "object" && parsedBody !== null && "message" in parsedBody) {
      messageText = String((parsedBody as { message: unknown }).message);
    }

    return NextResponse.json(
      {
        ok: true,
        status: interaktResponse.status,
        message: messageText,
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
