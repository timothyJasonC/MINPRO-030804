"use client"
import { UserContext } from "@/app/userContext"
import EventForm from "@/components/EventForm";
import { useContext, useState } from "react"

export default function page() {
    const { userInfo } = useContext<any>(UserContext);


    return (
        <div>
            <section className='py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
            </section>
            <div className='wrapper my-8'>
                <EventForm userId={userInfo.id} type="Create" />
            </div>
        </div>
    );
}
