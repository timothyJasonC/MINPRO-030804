"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { userDefaultValues } from "@/constants"
import Link from "next/link"
import { userFormLoginSchema, userFormRegisterSchema } from "@/lib/validator"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { createToken } from "@/app/action"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserContext } from "@/app/userContext"



type UserFormProps = {
    type: "Register" | "Login"
}

export default function UserForm({ type }: UserFormProps) {
    const router = useRouter()
    const [error, setError] = useState("")
    const [alerts, setAlerts] = useState(false)
    const { setUserInfo } = useContext<any>(UserContext)
    const initialValues = userDefaultValues
    const form = useForm<z.infer<typeof userFormLoginSchema> | z.infer<typeof userFormRegisterSchema>>({
        resolver: zodResolver(type === "Register" ? userFormRegisterSchema : userFormLoginSchema),
        defaultValues: initialValues,
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof userFormLoginSchema> | z.infer<typeof userFormRegisterSchema>) {
        if (type === "Register") {
            try {
                const response = await fetch('http://localhost:8000/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                const data = await response.json()
                if (response.status === 200) {
                    setAlerts(true)
                    setError("")
                }
                if (data.message === "Wrong referral code") {
                    setError("Wrong Referral Code")
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (type === "Login") {
            try {
                const response = await fetch('http://localhost:8000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                const data = await response.json()
                console.log(response);
                if (data.message === "User not found!") {
                    setError("User Not Found")
                }
                if (data.message === "Not active") {
                    setError("Your accont hasn't been activate yet, activate it first at your email on your email")
                }
                if (data.message === "Wrong Password!") {
                    setError("Wrong Password")
                }
                if (response.ok) {
                    localStorage.setItem('token', data.token)
                    createToken(data.token)
                    setUserInfo(data.token)
                    window.location.reload();
                    window.location.href = '/profile'
                    // router.push('/profile')
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
                    <p>Don't have an account? <Link href='/register' className="text-blue-700">Register</Link></p>
                ) : (
                    <>
                        <p>Already have an account? <Link href='/login' className="text-blue-700">Login</Link></p>
                        {alerts && (
                            <Alert>
                                <AlertTitle>Verification email has been send</AlertTitle>
                                <AlertDescription>
                                    Check your email to activate your account, after you activate your account, you can login!
                                </AlertDescription>
                            </Alert>
                        )}
                    </>
                )

                }
            </form>
        </Form>
    )
}
