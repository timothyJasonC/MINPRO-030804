"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


const formSchema = z.object({
    email: z.string().email().nonempty("Email is required"),
})

export default function page() {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/resetPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
        const info = await res.json()
        if (info.message === 'Account not found') {
            toast({
                description: "There is no account that use this email, Please use another email account",
                className: "bg-primary-50 rounded-xl "
            })
        }
        if (info.status === 'ok') {
            toast({
                description: `We have send an email to ${values.email}, please confirm to change your password`,
                className: "bg-primary-50 rounded-xl "
            })
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" min-h-[75vh] items-center justify-center flex flex-col gap-5 max-w-[380px] md:max-w-[480px] mx-auto">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="johndoe@gmail.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                input your email to update password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
