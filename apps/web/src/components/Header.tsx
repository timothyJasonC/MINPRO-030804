import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import { Button } from "./ui/button";
import MobileNav from "./MobileNav";

export const Header = () => {
  return (
    <header className='w-full border-b bg-primary-50'>
      <div className="wrapper flex items-center justify-between">
        <Link href={'/'} className='w-36'>
          <Image width={128} height={38} alt='logo' src={'/images/logo.svg'} />
        </Link>
        <nav className='md:flex-between hidden w-full max-w-xs'>
          <NavItems />
        </nav>
        <div className='flex w-32 justify-end gap-3'>

          <Button asChild className='rounded-full' size={"lg"}>
            <Link href={'/sign-in'}>Login</Link>
          </Button>
          <MobileNav/>
        </div>
      </div>
    </header>
  )
};
