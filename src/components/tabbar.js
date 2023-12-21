"use client"
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {auth} from '../firebase'
export default function TabBar()
{

    return(
    
        <>
        <div className="fixed bottom-0 border border-2 w-full">
            <div className="w-full flex gap-2 justify-center items-center">
            <Link href={'account/vids'}>Videos</Link>
            <Link href={'account/upload'}>Upload</Link>
            <Link href={'account/profile'}>Profile</Link>

            </div>

        </div>
        </>
    )
}