import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";

type EventFormProps = {
    userId: string;
    type: "Create" | "Update";
    eventId?: number;
};

export default function EventForm({ userId, type, eventId }: EventFormProps) {
    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            // description: "",
            // location: "",
            // imageUrl: "",
            // startDateTime: new Date(),
            // endDateTime: new Date(),
            // price: "",
            // isFree: false,
            // category: ""
        }
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof eventSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
