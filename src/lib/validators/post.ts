import {z} from 'zod'

export const Postvalidator = z.object({
    title: z.string().min(3, {message: "title must be longer than three charecters"}).max(128, {message: "title exceeds the limit of 128 charecters"}),
    subredditId: z.string(),
    content: z.any(),
})

export type PostCreationRequest = z.infer<typeof Postvalidator>