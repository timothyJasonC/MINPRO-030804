"use client"

import { useParams } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"


export default function page() {
    const params = useParams()
    const router = useRouter()

    const handleVerify = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/users/activate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${params.token}`
                }
            })
            // if (res.ok) {
            //     router.push('/login')
            // }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="flex min-h-[60vh] flex-col w-[480px] items-center mx-auto justify-center gap-8">
            <h1>Click this Button to activate your accout</h1>
            <AlertDialog>
                <AlertDialogTrigger className="bg-primary-500 px-4 py-2 text-white rounded-full transition-all hover:bg-primary-50 hover:text-black">Activate Account</AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Activate Account</AlertDialogTitle>
                        <AlertDialogDescription>
                           After click confirm your account will be active and you will get a referral code that you can use to share to another user and get extra points, after that it will navigate you to login page
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVerify}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
