"use client"
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userProfileSchema } from "@/lib/validator";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof userProfileSchema>>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            username: "",
            email: "",
            image: ""
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                // const response = await fetch('http://localhost:8000/api/users/profile', {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/profile`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const userData = await response.json();
                form.setValue('username', userData.username);
                form.setValue('email', userData.email);
                form.setValue('image', userData?.image);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, [form]);

    const onSubmit = async (data: z.infer<typeof userProfileSchema>) => {
        try {
            const token = localStorage.getItem('token')
            const formData = new FormData();
            formData.set('username', data.username);
            formData.set('email', data.email);
            if (file) {
                formData.set('file', file)
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/update`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
            const info = await response.json()
            if (info.status === "update email") {
                toast({
                    description: `We have send an email to ${info.email}, please confirm to update your email address`,
                    className: "bg-primary-50 rounded-xl "
                })
                router.push('/profile')
            } else if (info.status === "user updated") {
                toast({
                    description: "Your user profile has been updated.",
                    className: "bg-primary-50 rounded-xl "
                })
                router.push('/profile')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-24 px-10 md:py-36 flex flex-col gap-2 md:gap-5 max-w-[380px] md:max-w-[480px] mx-auto" encType="multipart/form-data">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <ProfilePhoto onFieldChange={field.onChange} image={field.value} setUploadedFile={setFile} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex flex-col md:flex-row justify-between items-center">
                            <FormLabel>Username</FormLabel>
                            <div>
                                <Input placeholder="John Doe" {...field} />
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="flex flex-col md:flex-row justify-between items-center">
                            <FormLabel>Email</FormLabel>
                            <div>
                                <Input placeholder="john@gmail.com" {...field} />
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Update</Button>
            </form>
        </Form>
    );
}
