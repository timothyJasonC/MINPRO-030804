type User = {
    id: number
    isOrganizer: boolean
    referall: string
}

declare namespace Express {
    export interface Request {
        user?: User
    }
}