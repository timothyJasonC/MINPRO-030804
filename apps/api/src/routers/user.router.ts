import { UserController } from '@/controllers/user.controller';
import { uploader } from '@/helpers/uploader';
import { UserMiddleware } from '@/middleware/user.middleware';
import { Router } from 'express'
import multer from "multer"
const uploadMiddleware = multer({ dest: 'public/uploads' })

export class UserRouter {
    private router: Router;
    private userController: UserController;
    private userMiddleware: UserMiddleware

    constructor() {
        this.userController = new UserController()
        this.userMiddleware = new UserMiddleware()
        this.router = Router()
        this.initializeRoutes()
    }

    // this.router.put('/update', this.userMiddleware.verifyToken, uploader("", "/uploads").single('file'), this.userController.userUpdate)
    private initializeRoutes(): void {
        this.router.post('/profile', this.userMiddleware.verifyToken, this.userController.userProfile)
        this.router.put('/update', this.userMiddleware.verifyToken, uploadMiddleware.single('file'), this.userController.userUpdate)
        this.router.post('/register', this.userController.userRegister)
        this.router.post('/resetPassword', this.userController.resetPassword)
        this.router.post('/login', this.userController.userLogin)
        this.router.post('/send', this.userMiddleware.verifyToken, this.userController.sendEmail)
        this.router.get('/keep-login', this.userMiddleware.verifyToken, this.userController.keepLogin)
        this.router.get('/verify', this.userMiddleware.verifyToken, this.userController.verifyOrganizer)
        this.router.post('/activate', this.userMiddleware.verifyToken, this.userController.userActivate)
        this.router.get('/updateEmail', this.userMiddleware.verifyToken, this.userController.updateEmail)
        this.router.post('/updatePassword', this.userMiddleware.verifyToken, this.userController.updatePassword)
    }

    getRouter() {
        return this.router
    }
} 