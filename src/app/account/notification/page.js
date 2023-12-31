"use client"
import BackBtn from "@/components/backBtn";
import { useAuthContext } from "@/context/authcontext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "@/firebase";
import { collection, doc, query, onSnapshot, where, updateDoc, QuerySnapshot } from "firebase/firestore";
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
    useEffect(()=>{
        if(notificationMsg != null)
        {
            console.log(notificationMsg)
        }
    },[notificationMsg])
    return (

        <>
            <BackBtn />
            <div className="m-5">
                <div >
                    {(notificationMsg == null) ? null
                        : notificationMsg.map(not =>
                            <div key={not.id} className="flex felx-col gap-4">
                                <div className="flex gap-2 items-center">
                                    {not.nImg?<Image src={not.nImg} height={32} width={32} className="h-[32px] w-[32px] object-cover rounded-full" alt="notification images"></Image>:null}
                                    <p>{not.message}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}