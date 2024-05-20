import { boolean, number } from "zod"

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

export interface IEvent {
  id: number
  title: string
  description: string
  location: string
  imageUrl: string
  startDateTime: Date
  endDateTime: Date
  price: number
  isFree: boolean
  categoryId: number
  organizerId: number
  user: { username: string }
  category: { name: string }
}
export interface IEventUpdate {
  id: number
  title: string
  description: string
  location: string
  imageUrl: string
  startDateTime: string
  endDateTime: string
  price: number
  isFree: boolean
  categoryId: number
  organizerId: number
  user: { username: string }
}

export interface ITickets {
  id: number
  userId: number
  eventId: number,
  totalAmount: number
  createdAt: Date
  status: boolean
  quantity: number
  event: { title: string, imageUrl: string }
}
export interface ISales {
  title: string,
  imageUrl: string,
  Order: {
    id: number,
    userId: number,
    eventId: number,
    organizerId: number,
    totalAmount: number,
    quantity: number,
    createdAt: Date,
    status: boolean
  }
  totalQuantity: number;
  totalAmount: number;
}
export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  price: "",
  isFree: false,
  category: ""
};

export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}