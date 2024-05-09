import { Router } from 'express'
import { UserRouter } from './user.router'

export class ApiRouter {
    private userRouter: UserRouter
    private router: Router

    constructor() {
        this.router = Router()
        this.userRouter = new UserRouter()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.use('/users', this.userRouter.getRouter())
    }

    getRouter() {
        return this.router
    }
}