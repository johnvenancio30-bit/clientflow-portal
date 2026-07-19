import { notificationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = notificationSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { ok: false, error: "Invalid notification", issues: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return Response.json({
      ok: true,
      mode: "portfolio-demo",
      message: "Notification validated and simulated. No email was sent.",
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL ?? "ClientFlow <onboarding@resend.dev>",
      to: [result.data.recipient],
      subject: result.data.subject,
      text: result.data.message,
    }),
  });

  if (!response.ok) {
    return Response.json({ ok: false, error: "Notification provider rejected the request" }, { status: 502 });
  }

  const data = (await response.json()) as { id?: string };
  return Response.json({ ok: true, mode: "live", id: data.id });
}
