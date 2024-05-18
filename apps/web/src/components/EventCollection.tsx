import { IEvent } from '@/constants'
import Eventcard from './Eventcard'
import Pagination from './Pagination'

type CollectionProps = {
    event: IEvent[]
    emptyTitle: string,
    emptyStateSubtext: string,
    collectionType?: "Events_Organized"
    limit: number,
    page: number | string,
    totalPages?: number,
    urlParamName?: string,
}

export default function EventCollection({
    event,
    emptyTitle,
    emptyStateSubtext,
    collectionType,
    totalPages,
    urlParamName,
    limit,
    page
}: CollectionProps) {

    return (
        <section className='max-w-[380px] md:max-w-[800px] mx-auto'>
            {event && event.length > 0 ? (
                <div className='flex flex-col items-center gap-10 mx-auto'>
                    <ul className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10'>
                        {event.map((item, idx) => {
                            return (
                                <li key={idx} className='flex justify-center'>
                                    <Eventcard item={item} />
                                </li>
                            )
                        })}
                    </ul>
                    {totalPages && totalPages > 1 && (
                        <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
                    )}
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
