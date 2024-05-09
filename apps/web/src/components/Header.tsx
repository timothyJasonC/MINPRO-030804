"use client"
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import { Button } from "./ui/button";
import MobileNav from "./MobileNav";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isToken, setIsToken] = useState('');

  useEffect(() => {
    const token: any = localStorage.getItem('token');
    setIsToken(token)
  }, []);
  return (
    <header className='w-full border-b bg-primary-50'>
      <div className="wrapper flex items-center justify-between">
        <Link href={'/'} className='w-36'>
          <Image width={128} height={38} alt='logo' src={'/images/logo.svg'} />
        </Link>
        {isToken ? (
          <nav className='md:flex-between hidden w-full max-w-xs'>
            <NavItems />
          </nav>
        ) : null}
        <div className='flex w-32 justify-end gap-3'>
          {!isToken ? (
            <Button asChild className='rounded-full' size={"lg"}>
              <Link href={'/login'}>Login</Link>
            </Button>
          ) : (
            <MobileNav />
          )}
        </div>
      </div>
    </header>
  )
};
