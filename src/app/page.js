"use client"
import Link from "next/link"
import NavBar from "@/components/navbar"
import { useAuthContext } from "@/context/authcontext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function Home()
{
  const {user} = useAuthContext()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(user != null)
    {
      router.push('/account/vids')
    }
    else{
      setLoading(false)
    }
  },[user])

  if(!loading)
  return(
    <>
    <NavBar/>
    <div className="flex flex-col justify-center items-center  m-10 pt-20">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold text-center">Get Started!</h1>
        <Link href={'/login'} className=" py-2 bg-red-500 text-slate-100 rounded-md">Log In</Link>
        <Link href={'/signup'} className="py-2 bg-red-500 text-slate-100 rounded-md">Sign Up</Link>
      </div>
    </div>
    </>
  )
}