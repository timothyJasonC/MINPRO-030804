import { EventController } from '@/controllers/event.controller';
import { UserMiddleware } from '@/middleware/user.middleware';
import { Router } from 'express'
import multer from "multer"
const uploadMiddleware = multer({ dest: 'public/uploads' })

export class EventRouter {
    private router: Router;
    private eventController: EventController;
    private userMiddleware: UserMiddleware

    constructor() {
        this.eventController = new EventController()
        this.userMiddleware = new UserMiddleware()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post('/create',this.userMiddleware.verifyToken,uploadMiddleware.single('file'), this.eventController.createEvent)
        this.router.put('/update/:id',this.userMiddleware.verifyToken,uploadMiddleware.single('file'), this.eventController.updateEvent)
        this.router.get('/organizer',this.userMiddleware.verifyToken, this.eventController.getEventByOrganizer)
        this.router.delete('/delete',this.userMiddleware.verifyToken, this.eventController.deleteEvent)
        this.router.get('/:id', this.eventController.getEventById)
        this.router.get('/', this.eventController.getAllEvents)
    }

    getRouter() {
        return this.router
    }
}