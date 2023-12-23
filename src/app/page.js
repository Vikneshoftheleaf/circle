"use client"
import Link from "next/link"
import { logOut } from "@/functions/functions"
import { useAuthContext } from "@/context/authcontext"
export default function Home()
{
  const {user} = useAuthContext();
  return(
    <div className="flex flex-col justify-center items-center  m-10 pt-20">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold text-center">Get Started!</h1>
        <Link href={'/login'} className=" py-2 bg-red-500 text-slate-100 rounded-md">Log In</Link>
        <Link href={'/signup'} className="py-2 bg-red-500 text-slate-100 rounded-md">Sign Up</Link>
      </div>
    </div>
  )
}