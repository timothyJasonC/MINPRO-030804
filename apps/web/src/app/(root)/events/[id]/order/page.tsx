'use client'

import { UserContext } from "@/app/userContext"
import DropdownDiscount from "@/components/DropdownDiscount"
import { Button } from "@/components/ui/button"
import { formatToIDR } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

type OrderEventProps = {
  params: {
    id: string
  }
}

export default function page({ params: { id } }: OrderEventProps) {
  const { userInfo } = useContext<any>(UserContext)
  const [quantity, setQuantity] = useState<any>(1);
  const [event, setEvent] = useState<any>({})
  const [discount, setDiscount] = useState<any>('')
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [semiPrice, setSemiPrice] = useState()
  const token = localStorage.getItem('token')
  const router = useRouter()

  const getEvent = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/event/${id}`, {
      method: 'GET'
    })
    if (response.ok) {
      const eventData = await response.json()
      setEvent(eventData)
      setTotalPrice(eventData.price * quantity)
    }

  }
  useEffect(() => {
    getEvent()
  }, [])

  useEffect(() => {
    if (event.price) {
      let calculatedPrice = event.price * quantity;
      if (discount && discount.discount) {
        calculatedPrice = calculatedPrice * ((100 - discount.discount) / 100);
      }
      setTotalPrice(calculatedPrice);
    }
    if (event.price) {
      let calculatedPrice = event.price;
      if (discount && discount.discount) {
        calculatedPrice = calculatedPrice * ((100 - discount.discount) / 100);
      }
      setSemiPrice(calculatedPrice)
    }
  }, [event, quantity, discount])


  const decreaseQuantity = () => {
    setQuantity((prevState: any) => (quantity > 1 ? prevState - 1 : 1));
  };

  const increaseQuantity = () => {
    setQuantity((prevState: any) => prevState + 1);
  };

  const submitOrder = async (e: any) => {
    e.preventDefault()
    const data = {
      id: event.id,
      productName: event.title,
      price: event.price,
      semiPrice: semiPrice,
      quantity: quantity,
      discount: discount,
      eventOrganizerId: event.organizerId
    }
    console.log(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/order/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    const requestData = await response.json()
    console.log(requestData);

    router.push(requestData.redirect_url);

  }
  return (
    <div>
      <section className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${event.imageUrl}`}
            alt="hero-image"
            width={500}
            height={500}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>
              <h2 className="h2-bold">Price: {formatToIDR(event.price)}</h2>
              <h2 className="h2-bold">Total Price: {formatToIDR(totalPrice)}</h2>
              <div className="flex justify-between">
                <h2 className="text-xl">Quantity</h2>
                <div className="flex gap-4 items-center">
                  <button
                    className="transition-all hover:opacity-75"
                    onClick={decreaseQuantity}
                  >
                    ➖
                  </button>

                  <h1 className="text-black border-transparent text-center">{quantity}</h1>

                  <button
                    className="transition-all hover:opacity-75"
                    onClick={increaseQuantity}
                  >
                    ➕
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <DropdownDiscount value={discount} onChangeHandler={setDiscount} userId={userInfo.id} token={token} />
              </div>
            </div>
          <Button onClick={submitOrder}>Order</Button>
          </div>


        </div>

      </section>
    </div>
  )
}
