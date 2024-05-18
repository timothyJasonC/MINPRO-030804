import { IDiscount } from '@/constants'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

type CardProps = {
    item: IDiscount
}

export default function Card({ item }: CardProps) {
    const expirationDate = new Date(item.exprirationDate);

    // Mendapatkan tanggal dalam format "YYYY-MM-DD"
    const formattedDate = expirationDate.toISOString().split('T')[0]
    return (
        <section className='group relative flex min-h-[230px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[238px]'>
            <div className='flex-center flex-col gap-2 flex-grow bg-gray-50 bg-cover bg-center text-primary-500 font-semibold'>
                <h1 className='text-xl'>Discount Coupon</h1>
                <p className='text-5xl'>{item.discount}%</p>
            </div>
            <div className='flex items-center min-h-[30px] flex-col gap-3 p-5 md:gap-4'>
                <p>Expire on {formattedDate} </p>
                <Button className='rounded-full w-full' size={"lg"}>
                    <Link href={'/'}>Use now</Link>
                </Button>
            </div>
        </section>
    )
}
