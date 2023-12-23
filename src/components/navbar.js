"use client"
import Link from "next/link"
import { useAuthContext } from "@/context/authcontext"
export default function NavBar()
{
    let display;
    const {user} = useAuthContext();
    if(user)
    {
        display='hidden'
    }
    else
    {
        display='block'
    }
    return(

        <nav className={` ${display} p-4 border-b-2 mx-5`}>
            <div className="w-full flex justify-between">
                <Link href={'/'} className="text-4xl font-bold">Circle</Link>
            </div>
        </nav>
    )
}
