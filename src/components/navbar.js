"use client"
import Link from "next/link"
export default function NavBar()
{
    
    return(

        <nav className="p-4 border-b-2 mx-5">
            <div className="w-full flex justify-between">
                <Link href={'/'} className="text-4xl font-bold">Circle</Link>
            </div>
        </nav>
    )
}
