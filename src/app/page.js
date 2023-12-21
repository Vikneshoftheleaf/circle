"use client"
import Link from "next/link"
import { logOut } from "@/functions/functions"
export default function Home()
{
  return(
    <>
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