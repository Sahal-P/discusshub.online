import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {  } from "@/lib/validators/post";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')
  if (!q) return new Response("Invalid query", {status: 400})

  try {

    const results = await db.subreddit.findMany({
      where: {
        name: {
          startsWith: q,
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
