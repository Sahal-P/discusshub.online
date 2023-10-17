import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Commentvalidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { postId, text, replayToId } = Commentvalidator.parse(body);

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replayToId,
      },
    });

    return new Response("OK", { status: 201 });

  } catch (error) {

    if (error instanceof z.ZodError) {
      // 422 unprocessable entity
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not create comment, please try again later.", { status: 500 });

  }
}
