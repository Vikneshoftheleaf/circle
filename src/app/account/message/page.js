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
            <div className="flex items-center">
                <BackBtn/>
                <h1>Messages</h1>
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