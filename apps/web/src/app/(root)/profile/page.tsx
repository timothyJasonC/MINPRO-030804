"use client"
import { deleteToken } from "@/app/action"
import { UserContext } from "@/app/userContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import Collection from "@/components/Collection"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function page() {
  const { setUserInfo } = useContext<any>(UserContext)
  const [profile, setProfile] = useState<any>({})
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [alerts, setAlerts] = useState(false)
  const router = useRouter()
  const getData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (!token) {
        router.push('/')
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setProfile(data)
      const total = data.Point.reduce((acc: number, point: any) => acc + point.amount, 0);
      setTotalPoints(total)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const onLogout = () => {
    deleteToken('token');
    localStorage.removeItem('token');
    setUserInfo(null)
    Cookies.remove('token');
    window.location.reload()
  }

  const sendEmail = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/send`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setAlerts(true)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="w-full p-5 md:p-10">
      <div className="max-w-[380px] md:max-w-[500px] mx-auto mb-10">
        <h1 className="text-2xl text-center font-semibold">Profile</h1>
        <div className="flex flex-col gap-4 md:gap-8 mt-12">
          <label className="flex flex-col h-32 gap-1 w-32 mx-auto border rounded-full bg-transparent text-xl whitespace-nowrap text-gray-600">
            <Image src={profile?.image ? `http://localhost:8000/${profile.image}` : "/images/user.png"} alt="user" width={100} height={100} className=" w-32 h-32 object-cover rounded-full" />
          </label>
          <div className="flex justify-between text-xl">
            <h1 className="font-semibold">Username</h1>
            <h1>{profile?.username}</h1>
          </div>
          <div className="flex justify-between text-xl">
            <h1 className="font-semibold">Email</h1>
            <h1>{profile?.email}</h1>
          </div>
          <div className="flex justify-between text-xl">
            <h1 className="font-semibold">Referral Code</h1>
            <h1>{profile?.referral?.referralCode}</h1>
          </div>
          <div className="flex justify-between text-xl">
            <h1 className="font-semibold">Points</h1>
            <h1>{totalPoints}</h1>
          </div>
          <Button asChild className='rounded-full' size={"lg"}>
            <Link href={'/profile/edit'}>Edit Profile</Link>
          </Button>
          <Button onClick={onLogout} className='rounded-full w-full h-12' size={"lg"}>
            Logout
          </Button>
        </div>
      </div>

      <Collection
        data={profile?.Discount}
        emptyTitle="There is no discount available for you."
        emptyStateSubtext="Don't worry - many promotions waiting for you."
        collectionType="My_Promo"
      />

      <section className="py-6">

        {profile?.isOrganizer ? (
          <>
            <section className='max-w-[380px] md:max-w-[800px] mx-auto'>
              <div className='wrapper flex  items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                <Button asChild size='lg' className='button hidden sm:flex'>
                  <Link href='/events/create'>
                    Create New Events
                  </Link>
                </Button>
              </div>
            </section>
            <Collection
              data={profile?.Event}
              emptyTitle="No events have been created yet"
              emptyStateSubtext="Go create some now"
              collectionType="Events_Organized"
            />
          </>
        ) : (
          <div className='flex-center max-w-[380px] md:max-w-[800px] mx-auto wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center'>
            <h3 className='p-bold-20 md:h5-bold'>Be an Organizer to Make some Event</h3>
            <AlertDialog>
              <AlertDialogTrigger className="bg-primary-500 px-4 py-2 text-white rounded-full transition-all hover:bg-primary-50 hover:text-black">Verivy as Organizer</AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure want to verify as an Organizer?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently send verrification to your email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={sendEmail}>Send Email</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {alerts && (
              <Alert>
                <AlertTitle>Verification email has been send</AlertTitle>
                <AlertDescription>
                  Check your email to verify!
                </AlertDescription>
              </Alert>
            )}
          </div >
        )
        }
      </section>

    </section >
  )
}
