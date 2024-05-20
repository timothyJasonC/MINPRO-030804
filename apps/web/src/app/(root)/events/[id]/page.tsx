'use client'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatToIDR } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'


export default function page() {
    const { id } = useParams()
    const [event, setEvent] = useState<any>({})
    const [freeTicketStatus, setFreeticketStatus] = useState(null)
    const router = useRouter()
    const getEvent = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/event/${id}`, {
            method: 'GET'
        })
        if (response.ok) {
            setEvent(await response.json())
        }
    }

    const getUserFreeTicket = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/userFreeticket`, {
                method: 'POST',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setFreeticketStatus(await response.json())
        }
    }
    useEffect(() => {
        getEvent()
        getUserFreeTicket()
    }, [])

    const getFreeTicket = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/freeTicket`, {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const res = await response.json()
        console.log(res);
    }

    const hasEventFinished = new Date(event.endDateTime) < new Date() || event.ticket === 0

    return (
        <div>
            <section className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${event.imageUrl}`}
                        alt="hero-image"
                        width={2000}
                        height={2000}
                        className="h-full min-h-[300px] object-cover object-center"
                    />

                    <div className="flex w-full flex-col gap-8 p-5 md:p-10">
                        <div className="flex flex-col gap-6">
                            <h2 className="h2-bold">{event.title}</h2>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex gap-3 items-center">
                                    <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                                        {event.isFree ? 'FREE' : `${formatToIDR(event.price)}`}
                                    </p>
                                    <p className="p-medium-16 rounded-full bg-gray-500/10 px-4 py-2.5 text-gray-500">
                                        {event.category?.name}
                                    </p>
                                    <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                                        by{' '}
                                        <span className="text-primary-500">{event.user?.username}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {hasEventFinished ? (
                                    <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>
                                ) : (
                                    <>
                                        {event.isFree ? (
                                            <>
                                                {freeTicketStatus !== null ? (
                                                    <h1 className='p-2 text-red-400'>you have take this ticket, free ticket just can be take 1 by each other user.</h1>
                                                ) : (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <Button role="link" size="lg" className="button sm:w-fit">
                                                                <h1>Get Ticket</h1>
                                                            </Button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent className="bg-white">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure you want to take this Ticket?</AlertDialogTitle>
                                                                <AlertDialogDescription className="p-regular-16 text-grey-600">
                                                                    Once you take this ticket, it will added to your tickets. and you can't purchased the same ticket again because it's free
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={getFreeTicket}>
                                                                    Take
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                            </>
                                        ) : (
                                            <Button type="submit" role="link" size="lg" className="button sm:w-fit">
                                                <Link href={`/events/${id}/order`}>{event.isFree ? 'Get Ticket' : 'Buy Ticket'}</Link>
                                            </Button>

                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex gap-2 md:gap-3">
                                    <Image
                                        src="/icons/calendar.svg"
                                        alt="calendar"
                                        width={32}
                                        height={32}
                                    />
                                    <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                                        <p>
                                            {formatDateTime(event.startDateTime).dateOnly} - {' '}
                                            {formatDateTime(event.startDateTime).timeOnly}
                                        </p>
                                        <p>
                                            {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                                            {formatDateTime(event.endDateTime).timeOnly}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-regular-20 flex items-center gap-3">
                                    <Image src="/icons/location.svg" alt="location" width={32} height={32} />
                                    <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="p-bold-20 text-grey-600">What You'll Learn</p>
                                <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
