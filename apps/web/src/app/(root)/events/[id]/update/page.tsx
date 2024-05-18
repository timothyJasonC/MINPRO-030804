"use client"
import { UserContext } from "@/app/userContext"
import EventForm from "@/components/EventForm";
import UpdateEventForm from "@/components/UpdateEventForm";
import { useContext, useEffect, useState } from "react"

type UpdateEventProps = {
    params: {
        id: string
    }
}

export default function page({ params: { id } }: UpdateEventProps) {
    const { userInfo } = useContext<any>(UserContext);
    const [event, setEvent] = useState<any>({})

    

    return (
        <div>
            <section className='py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Update Event</h3>
            </section>
            <div className='wrapper my-8'>
                <UpdateEventForm eventId={id}/>
            </div>
        </div>
    );
}
