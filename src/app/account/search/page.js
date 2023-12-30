"use client"
import { useRouter } from "next/navigation"
import Link from "next/link";
import BackBtn from "@/components/backBtn";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot, orderBy, limit, or } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { useAuthContext } from "@/context/authcontext";
import { db, auth } from "@/firebase";
import Image from "next/image";
import SearchPosts from "@/components/searchPosts";
export default function Search() {
    const [userPosts, setUserPosts] = useState([]);
    const [searchPanel, setSearchPanel] = useState('hidden');
    const [searchQuery, setSearchQuery] = useState();
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("title", "desc"), limit(100));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            //const cities = [];
            setUserPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        return unsubscribe

    }, [])

    useEffect(() => {
        if (searchQuery) {
            if (searchQuery.length > 0) {
                const searchArray = searchQuery.split('');
                const sample = "viknesh"

                const q = query(collection(db, "user"), where('displayName', '==', searchQuery), limit(30));
                const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                    //const cities = [];
                    setSearchResult(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                    //console.log("Current cities in CA: ", cities.join(", "));
                });

                //console.log(searchArray);

                return unsubscribe
            }
        }


    }, [searchQuery])


    return (
        <div>
            <div className="flex gap-2 items-center p-2 relative">
                <BackBtn />
                <input type="text" onFocus={() => setSearchPanel('flex')} name="search" id="search" className="p-2 rounded-full w-full bg-red-50" placeholder="Search Videos" onChange={(e) => setSearchQuery(e.target.value)} />

            </div>

            <div className={`${searchPanel} absolute w-full h-full bg-white justify-center`}>
                <div className="w-full flex flex-col ">
                    {
                    (searchResult == null || searchResult.length == 0 )?null
                    :searchResult.map(res =>
                        <Link key={res.id} href={`/user/${res.uid}`} className="w-full flex items-center gap-4 border-b-2 px-4 py-2">
                            <div>
                                {(res.photoURL)
                                ?<Image src={res.photoURL} height={32} width={32} className="h-[32px] w-[32px] rounded-full object-cover" alt="userProfile"></Image>
                                :<Icon className="h-[32px] w-[32px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={32} width={32} />
                            }
                            </div>
                            <div className=" flex flex-col justify-center items-start">
                                <h1 className="text-lg font-bold flex gap-1 items-center">{res.displayName}{res.verified?<Icon className="text-blue-500" icon="material-symbols:verified" />:null}</h1>
                                <h1 className="text-sm">@{res.userName}</h1>
                            </div>
                        </Link>)}

                </div>

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