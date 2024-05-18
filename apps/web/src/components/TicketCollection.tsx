import { ITickets } from "@/constants"
import TicketCard from "./TicketCard"

type CollectionProps = {
    ticket: ITickets[]
    emptyTitle: string,
    emptyStateSubtext: string,
    limit: number,
    page: number | string,
    totalPages?: number,
    urlParamName?: string,
}
export default function TicketCollection({
    ticket,
    emptyTitle,
    emptyStateSubtext,
    totalPages,
    limit,
    page
}: CollectionProps
) {
    return (
        <section className='max-w-[380px] md:max-w-[800px] mx-auto'>
            {ticket && ticket.length > 0 ? (
                <div className='flex flex-col items-center gap-10 mx-auto'>
                    <ul className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10'>
                        {ticket.map((item, idx) => {
                            return (
                                <li key={idx} className='flex justify-center'>
                                    <TicketCard item={item} />
                                </li>
                            )
                        })}
                    </ul>
                    {/* {totalPages && totalPages > 1 && (
                        <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
                    )} */}
                </div>
            ) : (
                <div className='flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center'>
                    <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
                    <p className='p-regular-14'>{emptyStateSubtext}</p>
                </div>
            )}

        </section>
    )
}
