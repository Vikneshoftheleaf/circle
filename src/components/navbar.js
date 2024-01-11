"use client"
import Link from "next/link"
import ThemeSwitcher from "./themeSwitcher"
export default function NavBar()
{
    
    return(

        <nav className="fixed top-0 p-4 border-b-1 w-full backdrop-blur-xl z-10">
            <div className="w-full flex justify-start items-center gap-4 text-center">
                <Link href={'/'} className="text-2xl font-bold">Circle</Link>
                <ThemeSwitcher></ThemeSwitcher>
            </div>
        </nav>
    )
}
