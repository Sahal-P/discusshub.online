import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Postvalidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, title, content } = Postvalidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
        where: {
            subredditId,
            userId: session.user.id,
        },
    });

    if (!subscriptionExists) {
      // 409 conflict
      return new Response("Subscribe to post", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response("OK", { status: 201 });

  } catch (error) {

    if (error instanceof z.ZodError) {
      // 422 unprocessable entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not post to this subreddit at the moment, please try again later.", { status: 500 });

  }
}