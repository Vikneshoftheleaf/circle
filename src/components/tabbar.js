"use client"
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from '../firebase'
import { moon } from 'react-icons'
export default function TabBar() {

    const [authUser, setauthUser] = useState(null);
    const router = useRouter();
    
    useEffect(() => {

      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setauthUser(authUser);
        // Redirect to the dashboard if the user is already logged in
        /*if (!authUser) {
          router.push('/');
        }*/
      });
    
      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    });


    return (
        

        <>
            <div className="fixed bottom-0 border border-2 w-full p-2 bg-slate-950 text-slate-50">
                <div className="w-full flex gap-2 justify-center items-center">
                    <Link href={'account/vids'}>Videos</Link>
                    <Link href={'account/search'}>Search</Link>
                    <Link href={'account/upload'}>Upload</Link>
                    <Link href={'account/profile'}>Profile</Link>
                    <Link href={'account/setting'}>settings</Link>
                </div>

            </div>
        </>
    )
}