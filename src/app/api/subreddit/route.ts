import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function  POST(req: Request) {
    try {
        const session = await getAuthSession()
        console.log(session,'00000000000000000000000000');
        
        if (!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()
        const {name} = SubredditValidator.parse(body)

        console.log(name, body);
        
        const subredditExists = await db.subreddit.findFirst({
            where: {
                name,
            },
        })
        console.log('yes ', subredditExists);
        

        if (subredditExists) {
            // 409 conflict
            return new Response('Subreddit already exits', {status: 409})
        }

        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id
            }
        })

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id
            }
        })

        return new Response(subreddit.name, {status: 201})

    } catch (error) {
        if (error instanceof z.ZodError) {
            // 422 unprocessable entity
            return new Response(error.message, { status:422 })
        }
        console.log(error);
        
        return new Response('Could not create a subreddit', {status: 500})
    }
}