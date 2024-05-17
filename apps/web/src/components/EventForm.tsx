import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventSchema } from "@/lib/validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "./Dropdown";
import EventImage from "./EventImage";
import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import { IEvent } from "@/constants";
import { useRouter } from "next/navigation";

type EventFormProps = {
    type: "Create" | "Update";
    event?: IEvent
};

export default function EventForm({ type, event }: EventFormProps) {
    const [file, setFiles] = useState<File | null>(null)
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const router = useRouter()
    const initialValues = {
        title: "",
        description: "",
        location: "",
        imageUrl: "",
        startDateTime: new Date(),
        endDateTime: new Date(),
        price: '',
        isFree: false,
        categoryId: "",
        ticket: ''
    }
    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: initialValues,
        mode: "all"
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof eventSchema>) {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.set("title", values.title)
        data.set("description", values.description)
        data.set("location", values.location)
        if (file) {
            data.set("file", file)
        }
        data.set("startDate", startDate.toISOString())
        data.set("endDate", endDate.toISOString())
        data.set("price", values.price)
        data.set("isFree", values.isFree.toString())
        data.set("categoryId", values.categoryId)
        data.set('ticket', values.ticket)

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/event/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        })

        const info = await response.json()

        if (response.ok) {
            router.push(`/events/${info.id}`)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl className="bg-grey-50 rounded-full ">
                                        <Input placeholder="Event title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl className="h-72 rounded-xl bg-grey-50">
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl className="h-72">
                                        <EventImage onFieldChange={field.onChange} imageUrl={field.value} setFiles={setFiles} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                            <Image src="/icons/location-grey.svg" alt="location" width={24} height={24} />
                                            <Input placeholder="Event location or Online" {...field} className="input-field" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="startDateTime"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                            <Image src="/icons/calendar.svg" alt="location" width={24} height={24} />
                                            <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
                                            <DatePicker selected={startDate} onChange={(date: Date) => {
                                                setStartDate(date);
                                                field.onChange(date);
                                            }} maxDate={endDate}
                                                showTimeSelect timeInputLabel="Time:" dateFormat="MM/dd/yyyy h:mm aa" wrapperClassName="datepicker" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDateTime"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                            <Image src="/icons/calendar.svg" alt="location" width={24} height={24} />
                                            <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                                            <DatePicker selected={endDate} onChange={(date: Date) => {
                                                setEndDate(date);
                                                field.onChange(date);
                                            }} minDate={startDate}
                                                showTimeSelect timeInputLabel="Time:" dateFormat="MM/dd/yyyy h:mm aa" wrapperClassName="datepicker" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                            <Image src="/icons/dollar.svg" alt="dollar"
                                                width={24} height={24} />
                                            <Input type="number" placeholder="Price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                                            <FormField
                                                control={form.control}
                                                name="isFree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center">
                                                                <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free ticket</label>
                                                                <Checkbox onCheckedChange={field.onChange} checked={field.value} id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ticket"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                            <Image src="/icons/dollar.svg" alt="dollar"
                                                width={24} height={24} />
                                            <Input type="number" placeholder="Ticket" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
