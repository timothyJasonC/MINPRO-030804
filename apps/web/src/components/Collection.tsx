import React from 'react'
import Card from './Card'
import { IDiscount } from '@/constants'

type CollectionProps = {
    data: IDiscount[]
    emptyTitle: string,
    emptyStateSubtext: string,
    collectionType?: 'My_Promo' | "Events_Organized"
}

export default function Collection({
    data,
    emptyTitle,
    emptyStateSubtext,
    collectionType
}: CollectionProps) {
    return (
        <section className='max-w-[380px] md:max-w-[800px] mx-auto'>
            {data && data.length > 0 ? (
                <div className='flex flex-col items-center gap-10 mx-auto'>
                    <ul className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10'>
                        {data.map((item) => {
                            return (
                                <li className='flex justify-center'>
                                    <Card item={item} />
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
