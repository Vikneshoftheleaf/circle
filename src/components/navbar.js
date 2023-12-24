"use client"
import Link from "next/link"
export default function NavBar()
{
    
    return(

        <nav className="fixed top-0 bg-white p-2 border-b-2 w-full">
            <div className="w-full flex justify-between">
                <Link href={'/'} className="text-4xl font-bold">Circle</Link>
            </div>
        </nav>
    )
}
