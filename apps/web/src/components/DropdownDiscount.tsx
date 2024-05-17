'use client'
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from '@/lib/utils';

type DropdownProps = {
    value?: any;
    onChangeHandler?: (value: string) => void;
    userId: number,
    token: string | null
};

export default function DropdownDiscount({ value, onChangeHandler, userId, token }: DropdownProps) {
    const [discount, setDiscount] = useState<any>([])
    const getDiscount = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/discount`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json()
        setDiscount(data)
    }

    useEffect(() => {
        getDiscount()
    }, [])

    return (
        <Select onValueChange={onChangeHandler} defaultValue={value}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Discount" />
            </SelectTrigger>
            <SelectContent>
                {discount.length > 0 && discount.map((disc:any) => (
                    <SelectItem aria-selected={value == disc.id.toString()} key={disc.id} value={disc} className='select-item p-reguler-14'>
                        {disc.discount} % discount coupont and <br />will expire on {formatDateTime(disc.exprirationDate).dateOnly}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
