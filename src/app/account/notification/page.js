"use client"
import BackBtn from "@/components/backBtn";
import { useAuthContext } from "@/context/authcontext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "@/firebase";
import { collection, doc, query, onSnapshot, where, updateDoc, QuerySnapshot, deleteDoc, getDocs } from "firebase/firestore";
import { Icon } from "@iconify/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Notification() {
    const { profile } = useAuthContext();
    const [notificationMsg, setNotificationMsg] = useState([]);

    useEffect(() => {

        const cref = collection(db, 'notifications')
        const q = query(cref, where('notificationTo', '==', profile.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setNotificationMsg(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })

        return unsubscribe;

    }, [])
    useEffect(() => {
        if (notificationMsg != null) {
            console.log(notificationMsg)
        }
    }, [notificationMsg])


    async function deleteNotification() {

        const cref = collection(db, 'notifications')
        const q = query(cref, where('notificationTo', '==', profile.uid));
        getDocs(q)
        .then((QuerySnapshot) => {
          // Iterate through the documents
          QuerySnapshot.forEach((doc) => {
            // Delete each document using deleteDoc with the document reference directly
            deleteDoc(doc.ref)
              .then(() => {
                console.log('Document successfully deleted!');
              })
              
          });
        })
        

    }


    return (

        <>
            <div>
                <div className="flex justify-between items-center m-4">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Icon icon="zondicons:dots-horizontal-triple" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem><button onClick={() => deleteNotification()}>Clear All</button></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="m-5">
                    <div className="flex flex-col gap-2" >
                        {(notificationMsg == null) ? null
                            : notificationMsg.map(not =>
                                <div key={not.id} className="flex felx-col gap-4">
                                    <div className="flex gap-2 items-center">
                                        {not.nImg ? <Image src={not.nImg} height={42} width={42} className=" border-2 h-[42px] w-[42px] object-cover rounded-full" alt="notification images"></Image> : null}
                                        <p className="text-sm">{not.message}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </>
    )
}