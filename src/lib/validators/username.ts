import {z} from 'zod'

export const UsernameValidator = z.object({
    name: z.string().min(3, {message: "title must be longer than three charecters"}).max(32, {message: "title exceeds the limit of 128 charecters"}).regex(/^[a-zA-Z0-9_]+$/),
})

export type UsernameRequest = z.infer<typeof UsernameValidator>