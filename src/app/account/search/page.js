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

                const q = query(collection(db, "user"), where('userNameArray', 'array-contains-any', searchArray), limit(30));
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
            <div className="flex gap-2 items-center justify-start bg-red-50 m-4 px-2 relative">
            <Icon
                icon="uil:search"
                width="32"
                height="32"
                className="p-2 rounded-md bg-red-50"
              />
                <input type="search" onFocus={() => setSearchPanel('flex')} name="search" id="search" className="focus:outline-none p-2 rounded-md w-full bg-red-50" placeholder="Search Videos" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className={`${searchPanel} absolute w-full h-full bg-white text-slate-900 justify-center`}>
                <div className="w-full flex flex-col ">
                    {
                    (searchResult == null || searchResult.length == 0 )?null
                    :searchResult.map(res =>
                        <Link key={res.id} href={`/user/${res.uid}`} className="w-full flex items-center gap-4  px-4 py-2">
                            <div>
                                {(res.photoURL)
                                ?<Image src={res.photoURL} height={48} width={48} className="h-[48px] w-[48px] rounded-full object-cover" alt="userProfile"></Image>
                                :<Icon className="h-[32px] w-[32px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={32} width={32} />
                            }
                            </div>
                            <div className="flex flex-col gap-0 items-start leading-tight ">
                                <p className="text-sm flex gap-1 items-center">{res.displayName}{res.verified?<Icon className="text-blue-500" icon="material-symbols:verified" />:null}</p>
                                <p className="text-sm text-gray-400">@{res.userName}</p>
                                <p className="text-sm text-gray-400">{res.followers} Followers</p>
                            </div>
                        </Link>)}

                </div>

            </div>
            
            <div className="grid grid-cols-3 gap-1">
                {userPosts.map(upost =>
                    <Link key={upost.id} href={`/account/search/p?view=${upost.id}`}>
                        <SearchPosts data={upost} />
                    </Link>
                )}
            </div>
        </div>
    )
}