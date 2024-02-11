'use client'
import BackBtn from "@/components/backBtn";
import ChatBoards from "@/components/chatBoards";
import { useAuthContext } from "@/context/authcontext";
import { db } from "@/firebase";
import { where ,query, collection,onSnapshot,QuerySnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
export default function Message() {

    const {profile} = useAuthContext();
    const [allchats, setallchats] = useState()
    useEffect(() => {
        const cref = collection(db, 'messageRooms')

        const q = query(cref, where("members", 'array-contains', profile.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setallchats(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
    
          return unsubscribe;

    }, [])

    useEffect(()=>{
        if(allchats != null)
        {
            console.log(allchats)
        }
    },[allchats])

    return (

        <div>
            <div className="sticky top-0 right-0 z-10 py-2 dark:bg-neutral-900 bg-white w-full my-4 px-4 flex items-center">
                <h1 className="text-xl font-bold">Messages</h1>
            </div>

            <div>
                {(allchats != null && allchats.length > 0)
                
                ?allchats.map(a => <ChatBoards key={a.id} data={a} profile={profile}/>)
                :null
                
                }
            </div>
        </div>
    )
}