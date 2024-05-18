import { Router } from 'express'
import { UserRouter } from './user.router'
import { CategoryController } from '@/controllers/category.controller'
import { CategoryRouter } from './category.router'
import { EventRouter } from './event.router'
import { OrderRouter } from './order.router'

export class ApiRouter {
    private userRouter: UserRouter
    private categoryRouter: CategoryRouter
    private eventRouter: EventRouter
    private orderRouter: OrderRouter
    private router: Router

    constructor() {
        this.router = Router()
        this.userRouter = new UserRouter()
        this.categoryRouter = new CategoryRouter()
        this.eventRouter = new EventRouter()
        this.orderRouter = new OrderRouter()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.use('/users', this.userRouter.getRouter())
        this.router.use('/category', this.categoryRouter.getRouter())
        this.router.use('/event', this.eventRouter.getRouter())
        this.router.use('/order', this.orderRouter.getRouter())
    }

    getRouter() {
        return this.router
    }
}