'use client'
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from './ui/input';

type DropdownProps = {
    value?: string;
    onChangeHandler?: (value: string) => void;
};

interface ICategory {
    id: number;
    name: string;
}

export default function Dropdown({ value, onChangeHandler }: DropdownProps) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [data, setData] = useState("")

    const handleAddCategory = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/category/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategory.trim() })
        });
        const res = await response.json();
        setCategories((prevState) => [...prevState, res]);
    };

    useEffect(() => {
        const getCategories = async () => {
            const categoryList = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/category/`, {
                method: 'GET'
            });
            const res = await categoryList.json();
            res && setCategories(res as ICategory[]);
        };
        getCategories();
        setData(value!)
    }, [value]);


    return (
        <div>
            <Select onValueChange={onChangeHandler} value={data}>
                <SelectTrigger className="select-field">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.length > 0 && categories.map((category) => (
                        <SelectItem aria-selected={value == category.id.toString()} key={category.id} value={category.id.toString()} className='select-item p-reguler-14'>
                            {category.name}
                        </SelectItem>
                    ))}
                    <AlertDialog>
                        <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add New Category</AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>New Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Input type="text" placeholder="Category name" className="input-field mt-3" onChange={e => setNewCategory(e.target.value)} />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAddCategory}>Add</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </SelectContent>
            </Select>
        </div>
    );
}
