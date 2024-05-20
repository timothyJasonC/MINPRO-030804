"use client"
import { UserContext } from "@/app/userContext"
import EventForm from "@/components/EventForm";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react"

export default function page() {
    const { userInfo } = useContext<any>(UserContext);
    const router = useRouter()
    console.log(userInfo);
    
    useEffect(() => {
        if (userInfo && userInfo.isOrganizer === false) {
            router.push('/profile');
        }
    }, [userInfo, router])
    return (
        <div>
            <section className='py-5 md:py-10'>
                <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
            </section>
            <div className='wrapper my-8'>
                <EventForm type="Create" />
            </div>
        </div>
    );
}
