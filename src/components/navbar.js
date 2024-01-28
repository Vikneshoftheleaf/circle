"use client"
import Link from "next/link"
import ThemeSwitcher from "./themeSwitcher"
import { useAuthContext } from "@/context/authcontext"
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { collection, query, where, getDocs, QuerySnapshot, doc, onSnapshot } from "firebase/firestore";
export default function NavBar() {
    const { profile } = useAuthContext();
    const { user } = useAuthContext()
    const [loading, setloading] = useState(true);
    const [totalUnreadMessage, settotalUnreadMessage] = useState()

    useEffect(() => {

        if (profile != null) {
            const cref = collection(db, 'chats')

            const q = query(cref, where("read", '==', false), where('to', '==', profile.uid));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                settotalUnreadMessage(QuerySnapshot.size)
            })

            return unsubscribe;
        }

    }, [])

    return (

        <>
            {
                (user == null)
                    ?
                    <div >
                        <nav className="fixed hidden lg:flex top-0 border-b-1 w-full dark:bg-neutral-900 bg-white z-10 p-2 ">
                            <div className="flex justify-between w-[80%] mx-auto items-center h-full">

                                <div>
                                        <Image src={'/favicon.png'} height={60} width={60} alt="logo" priority></Image>
                                    
                                </div>

                                <div className="flex gap-2 items-center px-2">
                                    <ThemeSwitcher />
                                </div>


                            </div>
                        </nav>

                        <nav className="lg:hidden fixed top-0 border-b-1 w-full dark:bg-neutral-900 bg-white z-10 p-2 ">
                            <div className="w-full flex justify-between items-center h-full">


                                <div>
                                    <Image src={'/favicon.png'} height={50} width={50} alt="logo" priority></Image>
                                </div>

                                <div className="flex gap-2 items-center px-2">
                                    <ThemeSwitcher />
                                </div>
                            </div>
                        </nav>
                    </div>


                    :
                    <div>

                        <nav className="fixed hidden lg:block top-0 border-b-1 w-full  dark:bg-neutral-900 bg-white z-10 p-2 ">
                            <div className="flex justify-between w-[80%] items-center h-full">

                                <div>
                                        <Image src={'/favicon.png'} height={60} width={60} alt="logo" priority></Image>
                                </div>

                                <div className="flex gap-2 items-center px-2">
                                    <ThemeSwitcher />
                                </div>


                            </div>
                        </nav>

                        <nav className="lg:hidden fixed top-0 border-b-1 w-full dark:bg-neutral-900 bg-white z-10 p-2 ">
                            <div className="w-full flex justify-between items-center h-full">
                                <div className="flex gap-2 items-center px-2">
                                    <ThemeSwitcher />
                                </div>

                                <div>
                                        <Image src={'/favicon.png'} height={50} width={50} alt="logo" priority></Image>
                                </div>
                                {(user == null)
                                    ? <div></div>
                                    : <Link href={'/account/message'} className="relative flex justify-end p-2">
                                        <Icon height={28} width={28} icon="mingcute:message-3-line" />
                                        {(totalUnreadMessage != null && totalUnreadMessage > 0)
                                            ? <span className="text-xs text-slate-100 bg-red-500 rounded-full absolute top-0 right-0 px-[6px] py-[2px]">{totalUnreadMessage}</span>
                                            : null}
                                    </Link>
                                }

                            </div>
                        </nav>

                    </div>





            }



        </>
    )
}
