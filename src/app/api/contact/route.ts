import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (payload?.company) {
    return NextResponse.json({ ok: true });
  }

  if (
    !isText(payload?.firstName, 80) ||
    !isText(payload?.lastName, 80) ||
    !isText(payload?.email, 254) ||
    !EMAIL_PATTERN.test(payload.email.trim()) ||
    !isText(payload?.message, 5000)
  ) {
    return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.error("Contact email is missing required server configuration.");
    return NextResponse.json({ error: "Contact email is not configured." }, { status: 503 });
  }

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((address) => address.trim()),
    replyTo: email,
    subject: "New Arizona Alpine Trail website message",
    text: [`Name: ${firstName} ${lastName}`, `Email: ${email}`, "", message].join("\n"),
  });

  if (error) {
    console.error("Resend contact delivery failed:", error);
    return NextResponse.json({ error: "Message delivery failed." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: "Message sent.",
  });
}
