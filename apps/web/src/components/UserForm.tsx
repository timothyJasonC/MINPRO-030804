"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { userDefaultValues } from "@/constants"
import Link from "next/link"
import { userFormLoginSchema, userFormRegisterSchema } from "@/lib/validator"
import { useContext, useState } from "react"
import { createToken } from "@/app/action"
import { UserContext } from "@/app/userContext"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

type UserFormProps = {
    type: "Register" | "Login"
}

export default function UserForm({ type }: UserFormProps) {
    const [error, setError] = useState("")
    const { toast } = useToast()
    const search = useSearchParams()
    const redirect = search.get('redirect') || '/'

    const { setUserInfo } = useContext<any>(UserContext)
    const initialValues = userDefaultValues
    const form = useForm<z.infer<typeof userFormLoginSchema> | z.infer<typeof userFormRegisterSchema>>({
        resolver: zodResolver(type === "Register" ? userFormRegisterSchema : userFormLoginSchema),
        defaultValues: initialValues,
        mode: "all"
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof userFormLoginSchema> | z.infer<typeof userFormRegisterSchema>) {
        if (type === "Register") {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                const data = await response.json()
                if (response.status === 200) {
                    toast({
                        title: "Registration successful, please activate your account",
                        description: "Check your email to activate your account, after you activate your account, you can login!",
                        className: "bg-primary-50 rounded-xl"
                    })
                    setError("")
                }
                if (data.message === "This email has been taken by another user, please change your email") {
                    toast({
                        description: "This email has been taken by another user, please change your email",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("This email has been taken by another user, please change your email")
                }
                if (data.message === "This username has been taken by another user, please change your username") {
                    toast({
                        description: "This username has been taken by another user, please change your username",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("This username has been taken by another user, please change your username")
                }
                if (data.message === "Wrong referral code") {
                    toast({
                        title: "Wrong Referral Code",
                        description: "Please input a valide reff code or you can clear the input of reff code",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("Wrong Referral Code")
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (type === "Login") {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                const data = await response.json()
                console.log(response);
                if (data.message === "User not found!") {
                    toast({
                        description: "User not found",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("User Not Found")
                }
                if (data.message === "Not active") {
                    toast({
                        description: "Your accont hasn't been activate yet, activate it first at your email on your email",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("Your accont hasn't been activate yet, activate it first at your email on your email")
                }
                if (data.message === "Wrong Password!") {
                    toast({
                        description: "Wrong password",
                        variant: "destructive",
                        className: "rounded-xl"
                    })
                    setError("Wrong Password")
                }
                if (response.ok) {
                    // router.push('/profile')
                    toast({
                        description: "Login success",
                        className: "bg-primary-50 rounded-xl"
                    })
                    localStorage.setItem('token', data.token)
                    createToken(data.token, redirect)
                    setUserInfo(data)
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-[380px] md:max-w-[480px] mx-auto">
                {type === "Register" && (
                    <>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="flex justify-between items-center gap-4">
                                    <FormLabel>Username</FormLabel>
                                    <div>
                                        <FormControl className="w-full">
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex justify-between items-center gap-4">
                                    <FormLabel>Email</FormLabel>
                                    <div>
                                        <FormControl className="w-full">
                                            <Input placeholder="john@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </>
                )}
                {type === "Login" && (
                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center gap-4">
                                <FormLabel>Username or Email</FormLabel>
                                <div>
                                    <FormControl className="w-full">
                                        <Input placeholder="john@gmail.com or John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="flex justify-between items-center gap-4">
                            <FormLabel>Password</FormLabel>
                            <div>
                                <FormControl className="w-full">
                                    <Input placeholder="John123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                {type === "Register" && (
                    <FormField
                        control={form.control}
                        name="referall"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center gap-4">
                                <FormLabel>Referall Code</FormLabel>
                                <div>
                                    <FormControl className="w-full">
                                        <Input placeholder="John123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                )}
                <Button type="submit">{type === "Register" ? 'Register' : "Login"}</Button>
                <p className='text-red-600 text-[16px] mb-4 text-center'>{error && error}</p>
                {type === "Login" ? (
                    <p>Don't have an account? <Link href='/register' className="text-blue-700">Register</Link>. <br /> <Link href='/verify/forget_password' className="underline">Forget password?</Link>.</p>
                ) : (
                    <>
                        <p>Already have an account? <Link href='/login' className="text-blue-700">Login</Link></p>
                    </>
                )

                }
            </form>
        </Form>
    )
}
