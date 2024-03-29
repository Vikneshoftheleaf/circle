"use client"
import BackBtn from "@/components/backBtn";
import { useAuthContext } from "@/context/authcontext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "@/firebase";
import { collection, doc, query, onSnapshot, where, updateDoc, QuerySnapshot, deleteDoc, getDocs, orderBy } from "firebase/firestore";
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
        const q = query(cref, where('notificationTo', '==', profile.uid),orderBy('nat','desc'));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setNotificationMsg(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
            getDocs(q)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    updateDoc(doc.ref,{
                        read: true
                    })
                        

                });
        


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

            <div className="">
                <div className="sticky top-0 right-0 z-10 py-2 dark:bg-neutral-900 bg-white flex justify-between items-center my-4 px-4 w-full">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Icon icon="zondicons:dots-horizontal-triple" height={20} width={20}/>
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
                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <div className="col-span-2">
                                                {not.npImg ? <Image priority src={not.npImg} height={42} width={42} className=" border-2 h-[42px] w-[42px] object-cover rounded-full" alt="notification images"></Image>
                                                :<Icon className="h-[42px] w-[42px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={42} width={42} />                                               
                                            }
                                            </div>
                                            <p className="text-base col-span-6"><span className="font-semibold">{(not.nUserName==profile.userName)?'You':not.nUserName}</span> {not.message}</p>

                                        </div>
                                        <div className=" flex ">
                                            {not.nImg ? <Image priority src={not.nImg} className=" float-right h-[42px] w-[42px] rounded-md aspect-square object-cover" alt="post pic" height={42} width={42}></Image> : null}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

    )
}