'use client'
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from './ui/use-toast'
type DeleteConfirmationProps = {
    eventId: number
}

export default function DeleteConfirmation({ eventId }: DeleteConfirmationProps) {
    const { toast } = useToast()
    const deleteEvent = async () => {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/event/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ id: eventId })
        })
        if (response.ok) {
            toast({
                description: "Delete successfull",
                className: "bg-primary-50 rounded-xl"
            })
            window.location.reload()
        } else {
            toast({
                description: "Sorry, there was a problem deleting the item. Please try again later or contact our support team if the issue persists.",
                variant: "destructive",
                className: "rounded-xl"
            })
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Image src="/icons/delete.svg" alt="edit" width={20} height={20} />
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription className="p-regular-16 text-grey-600">
                        This will permanently delete this event
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={deleteEvent}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
