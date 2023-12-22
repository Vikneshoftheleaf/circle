"use client"
import Link from "next/link"
import { logOut } from "@/functions/functions"
import { useAuthContext } from "@/context/authcontext"
export default function Home()
{
  const {user} = useAuthContext();
  return(
    <>
    {user?user.email:"nouser"}
    <br />
    <Link href={'signup'}>Sign Up</Link>
    <br />
    <Link href={'login'}>Log In</Link>
    <br />
    <Link href={'account'}>account</Link>
    <br />
    <button onClick={()=>logOut()}>Log Out</button>
    </>
  )
}