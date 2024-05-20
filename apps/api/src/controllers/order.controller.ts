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

            const secret = process.env.NEXT_PUBLIC_SECRET as string
            const encededSecret = Buffer.from(secret).toString('base64')
            const basicAuth = `Basic ${encededSecret}`

            if (!req.user?.id) throw 'Please login'
            const newOrder = await prisma.order.create({
                data: {
                    totalAmount: totalAmount,
                    eventId: id,
                    userId: req.user?.id,
                    organizerId: eventOrganizerId,
                    quantity: quantity
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
                    gross_amount: totalAmount,
                    quantity: quantity
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

            if (discount !== '') {
                await prisma.discount.delete({
                    where: { id: discount.id }
                })
            }
            const event = await prisma.event.findUnique({
                where: { id: +id }
            })
            if (event) {
                await prisma.event.update({
                    where: { id: event.id },
                    data: { ticket: event.ticket - quantity }
                })
            }

            res.status(200).json(paymentLink)

        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async freeTicket(req: Request, res: Response) {
        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: +req.body.id
                }
            })
            const freeTicket = await prisma.order.create({
                data: {
                    organizerId: event?.organizerId!,
                    totalAmount: 0,
                    quantity: 1,
                    eventId: +req.body.id,
                    userId: req.user?.id!,
                    status: true
                }
            })
            res.json(freeTicket)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async getUserFreeTicket(req: Request, res: Response) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    userId: req.user?.id!,
                    totalAmount: 0,
                    eventId: +req.body.id
                }
            })
            res.json(order)
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
            console.log('abc');

            res.json('ok')
        } catch (err) {
            res.json(err)
        }
    }

    async getUserTicket(req: Request, res: Response) {
        try {
            const ticket = await prisma.order.findMany({
                orderBy: [
                    { id: 'desc' }
                ],
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

    async getOrganizerSales(req: Request, res: Response) {
        try {
            const events = await prisma.event.findMany({
                where: {
                    organizerId: req.user?.id,
                    Order: {
                        some: {}
                    }
                },
                select: {
                    title: true,
                    imageUrl: true,
                    Order: true
                }
            })

            const eventsWithTotals = events.map(event => {
                const totalQuantity = event.Order.reduce((acc, order) => acc + order.quantity!, 0);
                const totalAmount = event.Order.reduce((acc, order) => acc + order.totalAmount, 0);
                return {
                    ...event,
                    totalQuantity,
                    totalAmount
                };
            })
            res.json(eventsWithTotals)
        } catch (err) {
            res.json(err)
        }
    }
}