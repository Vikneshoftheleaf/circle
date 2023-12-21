"use client"
import { logOut } from "@/functions/functions";
export default function Profile()
{
return(
    <>
    <button onClick={()=>logOut()}>Log Out</button>
    </>
)
}