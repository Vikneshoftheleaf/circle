'use client'
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection,query,where, onSnapshot } from "firebase/firestore";
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";
export default function Friends({params})
{
    const place = params.slug
    const [people, setPeople] = useState()

    useEffect(() => {
        const cref = collection(db, 'user')
        const q = query(cref, where("place", '==', place));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPeople(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;
    }, [])

    useEffect(()=>{
        if(people != null)
        {
            console.log(people)
        }
    },[people])
    return(
        <div className="m-4">
            <div className="flex items-center gap-2 pb-2">
                <BackBtn></BackBtn>
                <h1 className="text-2xl font-semibold">{place}</h1>
            </div>
            <div>
                {(people != null)
                ?<div>
                    {people.map(p=>
                    <div key={p.id} className="w-full flex gap-2 justify-between items-center px-4">
                        <div className="flex items-center gap-4">
                            <div>
                            {(p.photoURL != null) ? <Image className="rounded-full h-[60px] w-[60px] object-cover" src={p.photoURL} height={80} width={80} alt="User"></Image>
                                            : <Icon className="h-[60px] w-[60px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={60} width={60} />

                                        }
                            </div>
                            <div>
                                {p.userName}
                                <br />
                                <span>From {p.place}</span>
                            </div>
                     </div>

                     <div>
                        <Link className="bg-red-500 text-slate-50 px-4 py-2 rounded-md" href={`/user/${p.id}`}>View</Link>
                     </div>
                    </div>
                    )}
                </div>
                : <h1 className="text-center py-10 text-xl font-gray-500 text-semibold">No Users Found!</h1>
            }
            </div>

        </div>


    )
}