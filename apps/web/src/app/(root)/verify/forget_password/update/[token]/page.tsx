"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


const formSchema = z.object({
    password: z.string().min(4, "Password must be at least 3 characters").max(30),
    confirm:  z.string().min(4, "Confirmation Password must be at least 3 characters").max(30)
})

export default function page() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: ''
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/updatePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${params.token}`
            },
            body: JSON.stringify(values)
        })
        const info = await res.json()
        console.log(info);
        if (info.message === 'Invalid confirmation') {
            toast({
                description: "The input between password and the confirmation doesn't match, please fix it.",
                className: "bg-primary-50 rounded-xl "
            })
        }
        if (info.status === 'ok') {
            toast({
                description: "Update Password Success",
                className: "bg-primary-50 rounded-xl "
            })
            router.push('/login')
        }
        
    }

    return (
        <div className="flex min-h-[60vh] flex-col w-[480px] items-center mx-auto justify-center gap-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" min-h-[75vh] items-center justify-center flex flex-col gap-5 max-w-[380px] md:max-w-[480px] mx-auto">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="John123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Confirmation Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="John123" {...field} />
                                </FormControl>
                                <FormDescription>
                                    fill this input with your new password
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
