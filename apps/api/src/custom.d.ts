type User = {
    id: number
    isOrganizer: boolean
    referall: string
    email: string
}

declare namespace Express {
    export interface Request {
        user?: User
    }
}