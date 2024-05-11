"use client"

import { useParams } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"



export default function page() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const handleVerify = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/updateEmail`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${params.token}`
                }
            })
            const info = await res.json()
            if (info.message === 'Email has been used with another account') {
                toast({
                    description: "Email has been used with another account, please change your email again and update your profile again",
                    className: "bg-primary-50 rounded-xl "
                })
            }
            if (info.message === 'Update Email Success') {
                toast({
                    description: "Update Email Success",
                    className: "bg-primary-50 rounded-xl "
                })
                router.push('/profile')
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="flex min-h-[60vh] flex-col w-[480px] items-center mx-auto justify-center gap-8">
            <h1>Click this Button to update your email address</h1>
            <AlertDialog>
                <AlertDialogTrigger className="bg-primary-500 px-4 py-2 text-white rounded-full transition-all hover:bg-primary-50 hover:text-black">Update Confirmation</AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure want to update your email?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently update your data. After you click confirm it will redirect you to your profile.
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
