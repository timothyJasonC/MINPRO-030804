import { CategoryController } from '@/controllers/category.controller';
import { UserMiddleware } from '@/middleware/user.middleware';
import { Router } from 'express'

export class CategoryRouter {
    private router: Router;
    private categoryController: CategoryController;

    constructor() {
        this.categoryController = new CategoryController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/create',this.categoryController.createCategory)
        this.router.get('/',this.categoryController.getCategoryList)
    }

    getRouter() {
        return this.router
    }
}