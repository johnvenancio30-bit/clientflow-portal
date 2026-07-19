export const dynamic = "force-static";

export async function GET() {
  return Response.json({
    ok: true,
    service: "clientflow",
    demoMode: !process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
