"use client"
import Link from "next/link"
import ThemeSwitcher from "./themeSwitcher"
import { useAuthContext } from "@/context/authcontext"
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { Icon } from "@iconify/react";
import { collection, query,where,getDocs,QuerySnapshot, doc, onSnapshot } from "firebase/firestore";
export default function NavBar() {
    const { profile } = useAuthContext();
    const [loading, setloading] = useState(true);
    const [totalUnreadMessage, settotalUnreadMessage] = useState()

    useEffect(() => {
        const cref = collection(db, 'chats')

        const q = query(cref, where("read", '==', false), where('to', '==', profile.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            settotalUnreadMessage(QuerySnapshot.size)
        })
    
          return unsubscribe;

    }, [])

    if (loading)
        return (

            <nav className="fixed top-0 border-b-1 w-full backdrop-blur-xl z-10 p-2 ">
                <div className="w-full flex justify-between items-center h-full">
                    <div className="flex gap-2">
                        <h1>Circle</h1>
                        <ThemeSwitcher/>
                    </div>
                    <Link href={'/account/message'} className="relative flex justify-end p-2">
                        <Icon className="text-2xl" icon="mingcute:message-3-line" />
                        {(totalUnreadMessage !=null && totalUnreadMessage > 0)
                        ?<span className="text-xs bg-red-500 rounded-full absolute top-0 right-0 px-[6px] py-[2px]">{totalUnreadMessage}</span>
                        :null}
                    </Link>
                </div>
            </nav>
        )
}
