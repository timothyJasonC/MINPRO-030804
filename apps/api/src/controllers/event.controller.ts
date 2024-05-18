import { Request, Response } from 'express'
import prisma from '@/prisma';
import fs from "fs"


export class EventController {
    async createEvent(req: Request, res: Response) {
        try {
            const isFree = req.body.isFree === 'true'
            const price = parseFloat(req.body.price)
            const ticket = parseFloat(req.body.ticket)
            const startDate = new Date(req.body.startDate)
            const endDate = new Date(req.body.endDate)
            const categoryId = +req.body.categoryId

            let newPath = null
            if (req.file) {
                const { originalname, path } = req.file
                const parts = originalname.split('.')
                const ext = parts[parts.length - 1]
                newPath = path + '.' + ext
                fs.renameSync(path, newPath)
            }

            const userId = req.user?.id
            if (userId) {
                const createdEvent = await prisma.event.create({
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        startDateTime: startDate,
                        endDateTime: endDate,
                        categoryId: categoryId,
                        organizerId: userId,
                        imageUrl: newPath!,
                        location: req.body.location,
                        price: price,
                        isFree: isFree,
                        ticket: ticket
                    }
                })
                res.status(200).json(createdEvent)
            }
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async updateEvent(req: Request, res: Response) {
        try {
            const isFree = req.body.isFree === 'true'
            const price = parseFloat(req.body.price)
            const ticket = parseFloat(req.body.ticket)
            const startDate = new Date(req.body.startDate)
            const endDate = new Date(req.body.endDate)
            const categoryId = +req.body.categoryId

            let newPath = null
            if (req.file) {
                const { originalname, path } = req.file
                const parts = originalname.split('.')
                const ext = parts[parts.length - 1]
                newPath = path + '.' + ext
                fs.renameSync(path, newPath)
            }

            const event = await prisma.event.findUnique({
                where: { id: +req.params.id }
            })

            const userId = req.user?.id
            if (userId) {
                const updateEvent = await prisma.event.update({
                    where: { id: +req.params.id },
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        startDateTime: startDate,
                        endDateTime: endDate,
                        imageUrl: newPath ? newPath : event?.imageUrl,
                        location: req.body.location,
                        price: price,
                        isFree: isFree,
                        categoryId: categoryId,
                        ticket: ticket
                    }
                })
                res.status(200).json(updateEvent)
            }
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async deleteEvent(req: Request, res: Response) {
        try {
            const { id } = req.body
            const deletedEvent = await prisma.event.delete({
                where: { id: id }
            })
            res.status(200).json(deletedEvent)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async getAllEvents(req: Request, res: Response) {
        try {
            let { q: query, category, page, limit } = req.query;

            if (typeof query !== "string") throw 'Invalid request'
            if (typeof category !== "string") throw 'Invalid request'
            if (typeof page !== "string" || isNaN(+page)) page = '1';
            if (typeof limit !== "string" || isNaN(+limit)) limit = '3'

            const events = await prisma.event.findMany({
                where: {
                    AND: [
                        { category: { name: { contains: category } } },

                    ],
                    OR: [
                        { title: { contains: query } },
                        { user: { username: { contains: query } } }
                    ]
                },
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                skip: (+page - 1) * +limit,
                take: +limit
            });

            const totalEvents = await prisma.event.count({
                where: {
                    AND: [
                        { category: { name: { contains: category } } },
                        {
                            OR: [
                                { title: { contains: query } },
                                { user: { username: { contains: query } } }
                            ]
                        }
                    ]
                }
            });
            console.log(category);
            const totalPages = Math.ceil(totalEvents / +limit)
            const currentPage = +page

            res.status(200).json({ events, totalPages, currentPage });
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async getEventById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const event = await prisma.event.findUnique({
                where: { id: +id },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    category: {
                        select: { name: true }
                    }
                }
            })
            res.status(200).json(event)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async getEventByOrganizer(req: Request, res: Response) {
        try {
            let { page, limit } = req.query

            if (typeof page !== "string" || isNaN(+page)) page = '1';
            if (typeof limit !== "string" || isNaN(+limit)) limit = '3'

            const events = await prisma.event.findMany({
                where: { organizerId: req.user?.id },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                skip: (+page - 1) * +limit,
                take: +limit
            })

            const totalEvents = await prisma.event.count({
                where: {
                    organizerId: req.user?.id
                }
            })

            const totalPages = Math.ceil(totalEvents / +limit)
            const currentPage = +page

            res.status(200).json({ events, totalPages, currentPage })  
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }
}