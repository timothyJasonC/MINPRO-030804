'use client'
import CategoryFilter from "@/components/CategoryFilter";
import EventCollection from "@/components/EventCollection";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
// import { SearchParamProps } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [event, setEvent] = useState([])
  const [totalPages, setTotalPages] = useState()
  const [currentPage, setCurrectPage] = useState(1)
  const search = useSearchParams()
  const searchQuery = search ? search.get('q') : null
  const categoryQuery = search ? search.get('category') : null
  const encodedsSearchQuery = encodeURI(searchQuery || '')
  const encodedsCategoryQuery = encodeURI(categoryQuery || '')
  const limitQuery = search ? search.get('limit') : '3';
  const currentQuery = search ? search.get('page') : '1';

  const getAllEvents = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/event?q=${encodeURIComponent(searchQuery || '')}&category=${encodeURIComponent(categoryQuery || '')}&limit=${encodeURIComponent(limitQuery || '3')}&page=${encodeURIComponent(currentQuery || '1')}`, {
      method: 'GET'
    })
    const res = await response.json()
    setEvent(res.events)
    setTotalPages(res.totalPages)
    setCurrectPage(res.currentPage)
  }

  useEffect(() => {
    getAllEvents()
  }, [encodedsSearchQuery, encodedsCategoryQuery, limitQuery, currentQuery])

  // console.log(categoryQuery);
  // console.log(searchQuery);

  return (
    <>
      <section className=" bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Celebrate: Your Events, Our Platform</h1>
            <p className="p-regular-20 md:p-regular-24">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.</p>
            <Button className="button w-full sm:w-fit" size="lg">
              <Link href="#events"  >
                Explore Now
              </Link>
            </Button>
          </div>
          <Image
            src={'/images/hero.png'}
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]" />
        </div>
      </section>

      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trust by <br /> Thousands of Events</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search data={searchQuery || ''} />
          <CategoryFilter data={categoryQuery || ''} />
        </div>

        <EventCollection
          event={event}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="Events_Organized"
          limit={3}
          page={currentPage}
          totalPages={totalPages}
        />
      </section>
    </>
  );
}
