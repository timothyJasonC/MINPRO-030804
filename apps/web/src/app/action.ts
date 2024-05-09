'use server'
import { cookies } from 'next/headers'
 
export async function createToken(token: string) {
  cookies().set('token', token)
}

export async function deleteToken(key: string) {
  cookies().delete(key)
}