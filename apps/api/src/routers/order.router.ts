import { OrderController } from '@/controllers/order.controller';
import { UserMiddleware } from '@/middleware/user.middleware';
import { Router } from 'express'

export class OrderRouter {
    private router: Router;
    private orderController: OrderController;
    private userMiddleware: UserMiddleware

    constructor() {
        this.orderController = new OrderController()
        this.userMiddleware = new UserMiddleware()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/discount',this.userMiddleware.verifyToken, this.orderController.getDiscount)
        this.router.post('/payment',this.userMiddleware.verifyToken, this.orderController.payment)
        this.router.get('/ticket',this.userMiddleware.verifyToken, this.orderController.getUserTicket)
        this.router.post('/status', this.orderController.checkStatus)
    }

    getRouter() {
        return this.router
    }
}