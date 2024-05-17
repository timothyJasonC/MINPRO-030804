import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { useDebounce } from 'use-debounce';

export default function Search({ placeholder = 'Search title...', data }: { placeholder?: string, data: string }) {
    const [query, setQuery] = useState(data);
    const [value] = useDebounce(query, 1000);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        let newUrl = '';

        if (query) {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'q',
                value: value
            });
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['value']
            });
        }
        router.push(newUrl, { scroll: false });
    }, [value, searchParams, router])

    return (
        <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
            <Image src="/icons/search.svg" alt="search" width={24} height={24} />
            <Input
                type="text"
                placeholder={placeholder}
                defaultValue={data}
                onChange={(e) => setQuery(e.target.value)}
                className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    );
}