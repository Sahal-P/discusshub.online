import {z} from 'zod'

export const Commentvalidator = z.object({
    postId: z.string(),
    text: z.string(),
    replayToId: z.string().optional()
})

export type CommentCreationRequest = z.infer<typeof Commentvalidator>