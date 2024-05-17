'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ICategory {
    id: number;
    name: string;
}

export default function CategoryFilter({data}: any) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const getCategories = async () => {
            const categoryList = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/category/`, {
                method: 'GET'
            });
            const res = await categoryList.json();
            res && setCategories(res as ICategory[]);
        };
        getCategories();
    }, [searchParams, router]);

    const onSelectCategory = (category: string) => {
        let newUrl = '';

        if(category && category !== 'All') {
          newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'category',
            value: category
          })
        } else {
          newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['category']
          })
        }
console.log(newUrl);

        router.push(newUrl, { scroll: false });
    }
    
    return (
        <Select onValueChange={(value: string) => onSelectCategory(value)} defaultValue={data}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>

                {categories.map((category) => (
                    <SelectItem value={category.name} key={category.id} className="select-item p-regular-14">
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
