import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')
  if (!q) return new Response("Invalid query", {status: 400})

  try {

    const results = await db.subreddit.findMany({
      where: {
        name: {
          startsWith: q,
          mode: "insensitive",
        },
      },
      include: {
        _count: true
      },
      take: 5,
    });
    return new Response(JSON.stringify(results));

  } catch (error) {

    return new Response(
      "Could not post fetch results.",
      { status: 500 }
    );
  }
}
