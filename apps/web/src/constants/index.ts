import { ReactNode } from "react"

export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Create Event',
    route: '/events/create',
  },
  {
    label: 'My Profile',
    route: '/profile',
  },
]


export const userDefaultValues = {
  username: '',
  email: '',
  password: '',
  referall: ""
}
export interface IDiscount {
  id: number,
  userId: number,
  discount: number,
  exprirationDate: Date
}