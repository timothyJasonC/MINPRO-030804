import { ITickets } from '@/constants'
import { formatDateTime, formatToIDR } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type CardProps = {
    item: ITickets
}

export default function TicketCard({ item }: CardProps) {
    return (
        <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
            <Link
                href={`/events/${item.eventId}`}
                className='flex-center relative flex-grow bg-gray-50 bg-cover bg-center text-grey-500'>
                <Image src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.event.imageUrl}`} className='object-cover rounded-t-xl w-96 h-[190px]' alt="edit" width={200} height={100} />
            </Link>

            <Link href={`/events/${item.eventId}`}
                className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'
            >
                <div className='flex gap-2'>
                    <span className='p-semibold-14 w-min rounded-full bg-grey-500/10  px-4 py-1 text-primary-500'>
                        {`${formatToIDR(item.totalAmount)}`}
                    </span>
                    <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600'>
                        {item.status === true ? 'Paid' : 'Pending'}
                    </span>
                </div>

                <p className='p-medium-16 p-medium-18 text-grey-500'>
                    {item.event.title}
                </p>
                <p className='p-medium-16 p-medium-18 text-grey-500'>
                    {formatDateTime(item.createdAt).dateTime}
                </p>


                <div className='flex-between w-full'>
                    <p className='p-medium-14 md:p-medium-16 text-grey-600'>
                        Total Quantity:  {item.quantity}
                    </p>
                </div>
            </Link>
        </div>
    )
}
