import { Request, Response } from 'express'
import prisma from '@/prisma';

export class CategoryController {
    async createCategory(req: Request, res: Response) {
        try {
            const newCategory = await prisma.category.create({
                data: { ...req.body }
            })
            res.status(200).json(newCategory)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            });
        }
    }

    async getCategoryList(req: Request, res: Response) {
        try {
            const categoryList = await prisma.category.findMany()
            res.status(200).json(categoryList)
        } catch (err) {
            res.status(400).json({
                status: "error",
                message: err
            })
        }
    }
}