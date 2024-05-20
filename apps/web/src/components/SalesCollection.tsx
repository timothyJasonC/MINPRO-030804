import { ISales } from '@/constants'
import React from 'react'
import TicketCard from './TicketCard'
import Image from 'next/image'
import { formatToIDR } from '@/lib/utils'

type CollectionProps = {
    sales: ISales[]
    emptyTitle: string,
    emptyStateSubtext: string,
}

export default function SalesCollection({
    sales,
    emptyTitle,
    emptyStateSubtext
}: CollectionProps) {
    return (
        <section className='max-w-[380px] md:max-w-[800px] mx-auto'>
            {sales && sales.length > 0 ? (
                <div className='flex flex-col items-center gap-10 mx-auto'>
                    <ul className='grid w-full grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-10'>
                        {sales.map((item, idx) => {
                            return (
                                <li key={idx} className='flex w-96 bg-gray-100 flex-col md:flex-row items-center rounded-md gap-6 py-4 justify-center'>
                                    <Image src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${item.imageUrl}`}
                                        alt='eventImage' width={1000} height={1000} className='w-32 h-32 rounded-md' />
                                    <div className='flex flex-col justify-center'>
                                        <h1>{item.title}</h1>
                                        <h1>Total ticket: {item.totalQuantity}</h1>
                                        <h1>Total sales: {formatToIDR(item.totalAmount)}</h1>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : (
                <div className='flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center'>
                    <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
                    <p className='p-regular-14'>{emptyStateSubtext}</p>
                </div>
            )}

        </section>
    )
}
