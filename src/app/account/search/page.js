"use client"
import { useRouter } from "next/navigation"
import Link from "next/link";
import BackBtn from "@/components/backBtn";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot, orderBy } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import { db, auth } from "@/firebase";
import SearchPosts from "@/components/searchPosts";
export default function Search()
{
    const [userPosts, setUserPosts] = useState([]);


    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("title","desc"));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            //const cities = [];
            setUserPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        return unsubscribe

    }, [])
    return(
        <div>
            <div className="flex gap-2 items-center p-2">
                <BackBtn/>
                <input type="text" name="search" id="search" className="p-2 rounded-full w-full bg-red-50" placeholder="Search Videos"/>
                
            </div>
            <div className="w-full flex justify-center gap-4 font-bold">

                </div>
            <div className="grid grid-cols-3 gap-1 p-4">
                        {userPosts.map(upost =>
                            <Link key={upost.id} href={`/account/search/p?view=${upost.id}`}>
                                <SearchPosts data={upost} />
                            </Link>
                        )}
                    </div>
        </div>
    )
}