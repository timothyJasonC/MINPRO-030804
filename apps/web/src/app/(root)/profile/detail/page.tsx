'use client'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SalesCollection from '@/components/SalesCollection'
import dayjs from 'dayjs'
import { UserContext } from '@/app/userContext';

export default function Page() {
    const [order, setOrder] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>([])
    const [sortType, setSortType] = useState('day')
    const { userInfo } = useContext<any>(UserContext);

    const router = useRouter()

    const token = localStorage.getItem('token')

    const getOrderStatus = async () => {
        try {
            if (!token) {
                router.push('/')
                return
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/sales`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const res = await response.json()
            console.log(res)
            setOrder(res)
            processChartData(res, sortType)
        } catch (error) {
            console.log(error)
        }
    }

    const processChartData = (data: any, type: any) => {
        const groupedData = data.reduce((acc: any, item: any) => {
            const date = dayjs(item.Order[0].createdAt).format(type === 'day' ? 'YYYY-MM-DD' : (type === 'month' ? 'YYYY-MM' : 'YYYY'))
            if (!acc[date]) {
                acc[date] = 0
            }
            acc[date] += item.Order.reduce((sum: any, order: any) => sum + order.totalAmount, 0)
            return acc
        }, {})

        const chartData = Object.keys(groupedData).map(date => ({
            date,
            totalRevenue: groupedData[date]
        }))

        setChartData(chartData)
    }

    useEffect(() => {
        if (userInfo && userInfo.isOrganizer === false) {
            router.push('/profile');
        }
        getOrderStatus()
    }, [token, userInfo, router])

    useEffect(() => {
        processChartData(order, sortType)
    }, [sortType])

    return (
        <div className='max-w-[380px] md:max-w-[800px] mx-auto'>
            <h1 className='text-2xl font-semibold my-4 text-center'>Order Statistic</h1>
            <div className='my-4'>
                <label htmlFor='sort'>Sort By: </label>
                <select id='sort' value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value='day'>Day</option>
                    <option value='month'>Month</option>
                    <option value='year'>Year</option>
                </select>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <h1 className='text-2xl font-semibold my-4 text-center'>Events Status</h1>
            <SalesCollection
                sales={order}
                emptyTitle="No event tickets purchased yet"
                emptyStateSubtext="Create some event now"
            />
        </div>
    )
}
