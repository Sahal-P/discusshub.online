import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  try {
  const session = await getAuthSession();

  const followedCommunitiesIds: string[] = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      subredditId: true,
    },
  }).then(subscriptions => subscriptions.map(subscription => subscription.subredditId));

  const unsubscribedSubreddits = await db.subreddit.findMany({
    where: {
      NOT: {
        id: {
          in: followedCommunitiesIds,
        },
      },
    },
    take: 6,
    select: {
      id: true,
      name: true,
    },
  });

    
    return new Response(JSON.stringify(unsubscribedSubreddits));

  } catch (error) {

    if (error instanceof z.ZodError) {
      // 422 unprocessable entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response(
      "Could not post fetch more posts.",
      { status: 500 }
    );
  }
}
