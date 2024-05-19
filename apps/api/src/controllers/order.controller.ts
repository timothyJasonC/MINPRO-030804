import { Request, Response } from 'express'
import prisma from '@/prisma';
const Midtrans = require('midtrans-client')

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_SECRET,
})

export class OrderController {
    async getDiscount(req: Request, res: Response) {
        try {
            const userDiscount = await prisma.discount.findMany({
                where: { userId: req.user?.id }
            })
            res.status(200).json(userDiscount)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async payment(req: Request, res: Response) {
        try {
            const { id, productName, price, quantity, discount, eventOrganizerId } = req.body
            let disc = 0
            if (discount !== '') {
                const promo = await prisma.discount.findUnique({
                    where: { id: discount.id }
                })
                disc = promo?.discount || 0
            }

            const semiPrice = price * ((100 - disc) / 100)
            const totalAmount = semiPrice * quantity

            // res.json({semiPrice, totalAmount})

            const secret = process.env.NEXT_PUBLIC_SECRET as string
            const encededSecret = Buffer.from(secret).toString('base64')
            const basicAuth = `Basic ${encededSecret}`

            if (!req.user?.id) throw 'Please login'
            const newOrder = await prisma.order.create({
                data: {
                    totalAmount: totalAmount,
                    eventId: id,
                    userId: req.user?.id,
                    organizerId: eventOrganizerId
                }
            })

            let data = {
                item_details: [
                    {
                        id: id,
                        name: productName,
                        price: semiPrice,
                        quantity: quantity
                    }
                ],
                transaction_details: {
                    order_id: newOrder.id,
                    gross_amount: totalAmount
                },
                expiry: {
                    unit: 'minutes',
                    duration: 10
                }
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}`, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': 'true',
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': basicAuth
                },
                body: JSON.stringify(data)
            })
            const paymentLink = await response.json()

            res.status(200).json(paymentLink)

        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async checkStatus(req: Request, res: Response) {
        try {
            console.log(req.body);
            console.log(req.body.transaction_status);

            if (req.body.transaction_status == 'settlement') {
                await prisma.order.update({
                    data: { status: true },
                    where: { id: +req.body.order_id }
                })
            } else {
                console.log('gagal');

            }
            // if (req.body.transaction_status == 'settlement') {

            // }
            console.log('abc');

            res.json('ok')
        } catch (err) {
            res.json(err)
        }
    }

    async getUserTicket(req: Request, res: Response) {
        try {
            const ticket = await prisma.order.findMany({
                where: {
                    userId: req.user?.id,
                    status: true
                },
                include: {
                    event: {
                        select: {
                            title: true,
                            imageUrl: true
                        }
                    }
                }
            })
            res.status(200).json(ticket)
        } catch (err) {
            res.json(err)
        }
    }

    // async getOrganizerStatusOrder(req:Request, res: Response) {
    //     try {
    //         const order = await prisma.order.findMany({
    //             where: {event: }
    //         })
    //     } catch (err) {
    //         res.json(err)
            
    //     }
    // }
}