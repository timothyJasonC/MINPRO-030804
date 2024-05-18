'use client'
import { UserContext } from '@/app/userContext'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

export default function page() {
    const [event, setEvent] = useState<any>({})
    const router = useRouter()

    const token = localStorage.getItem('token')

    const getOrderStatus = async () => {
        try {
            if (!token) {
                router.push('/')
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/ticket`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const res = await response.json()
            console.log(res);
            setEvent(res.events)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrderStatus()
    }, [])

    return (
        <div>
            detail nya
        </div>
    )
}
