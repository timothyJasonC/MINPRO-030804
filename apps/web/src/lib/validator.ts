import { z } from "zod"

export const userFormRegisterSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    email: z.string().email().nonempty("Email is required"),
    password: z.string().min(4, "Password must be at least 3 characters").max(30),
    referall: z.string().optional()
})

export const userFormLoginSchema = z.object({
    data: z.string().nonempty("Email is required"),
    password: z.string().min(4, "Password must be at least 3 characters").max(30),
})

export const userProfileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    email: z.string().email().nonempty("Email is required"),
    image: z.union([z.string().optional(), z.any()])
})

export const eventSchema = z.object({
    title: z.string().min(3, 'Tittle must be at least 3 characters'),
    // description: z.string().min(3, "Description must be at least 3 characters").max(400, 'Description must be less than 400 characters'),
    // location: z.string().min(3, 'Location must be at least 3 characters').max(400, 'Location must be less than 400 characters'),
    // imageUrl: z.string(),
    // startDateTime: z.date(),
    // endDateTime: z.date(),
    // categoryId: z.string(),
    // price: z.string(),
    // isFree: z.boolean(),
})