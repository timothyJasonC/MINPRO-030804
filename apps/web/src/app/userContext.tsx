"use client"
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({})


export function UserContextProvider({ children }: any) {
    const [userInfo, setUserInfo] = useState({})
    const router = useRouter()
    const getData = async () => {
        const token = localStorage.getItem('token')
        try {
            if (!token) {
                return
            }
            // const response = await fetch('http://localhost:8000/api/users/keep-login', {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/keep-login`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            setUserInfo(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}