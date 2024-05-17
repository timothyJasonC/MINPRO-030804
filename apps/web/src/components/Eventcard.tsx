import { UserContext } from '@/app/userContext'
import { IEvent } from '@/constants'
import { formatDateTime, formatToIDR } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import DeleteConfirmation from './DeleteConfirmation'

type CardProps = {
    item: IEvent
}

export default function Eventcard({ item }: CardProps) {
    const { userInfo } = useContext<any>(UserContext);

    const isEventCreator = userInfo.id === item.organizerId;

    return (
        <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
            <Link
                href={`/events/${item.id}`}
                className='flex-center relative flex-grow bg-gray-50 bg-cover bg-center text-grey-500'>
                <Image src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.imageUrl}`} className='object-cover rounded-t-xl w-96 h-[190px]' alt="edit" width={200} height={100} />
            </Link>

            {isEventCreator && (
                <div className="absolute right-2 top-4 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
                    <Link href={`/events/${item.id}/update`}>
                        <Image src="/icons/edit.svg" alt="edit" width={20} height={20} />
                    </Link>

                    <DeleteConfirmation eventId={item.id} />
                </div>
            )}

            <Link href={`/events/${item.id}`}
                className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'
            >
                <div className='flex gap-2'>
                    <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600'>
                        {item.isFree ? 'FREE' : `${formatToIDR(item.price)}`}
                    </span>
                    <p className='p-semibold-14 w-min rounded-full px-4 py-1 bg-grey-500/10  text-grey-500 line-clamp-1'>
                        {item.category.name}
                    </p>
                </div>

                <p className='p-medium-16 p-medium-18 text-grey-500'>
                    {formatDateTime(item.startDateTime).dateTime}
                </p>

                <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>{item.title}</p>

                <div className='flex-between w-full'>
                    <p className='p-medium-14 md:p-medium-16 text-grey-600'>
                        {item.user.username}
                    </p>

                    {/* {hasOrderLink && (
                        <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
                            <p className="text-primary-500">Order Details</p>
                            <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
                        </Link>
                    )} */}
                </div>
            </Link>
        </div>
    )
}
