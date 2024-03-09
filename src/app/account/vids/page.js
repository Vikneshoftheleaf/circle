"use client";
import NavBar from "@/components/navbar";
import { collection, query, where, getDocs, getDoc, onSnapshot, orderBy, QuerySnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Posts from "@/components/posts";

import { useAuthContext } from "@/context/authcontext";
import Link from "next/link";
export default function Videos() {
    const { profile } = useAuthContext();

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);
    const districts = [
        "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Nellai",
        "Kanchipuram", "Tiruvannamalai", "Vellore", "Tiruppur", "Erode", "Dindigul",
        "Thanjavur", "Cuddalore", "Nagapattinam", "Trichy", "Namakkal", "Dharmapuri",
        "Kanyakumari", "Ariyalur", "Perambalur", "Villupuram", "Kallakurichi", "Ranipet",
        "Tirunelveli", "Tenkasi", "Pudukkottai", "Sivagangai", "Theni", "Ramanathapuram",
        "Virudhunagar", "Thoothukudi", "Chengalpattu", "Krishnagiri", "Nilgiris"
      ];

    useEffect(() => {
        const cref = collection(db, 'posts')
        const q = query(cref, orderBy('postedAt','desc'));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;
    }, [])

    useEffect(() => {
        if (posts) {
            setLoading(false)
        }
    }, [posts])

    if (loading) {
        return (<><h1>Users Posts...</h1></>)
    }
    else {
        return (
            <div>
                <NavBar />
                <div className="mt-16 lg:my-2 w-full p-4">
                    <h1 className="text-2xl py-4 font-semibold">Find New Friends!</h1>
                    <div className="sm:w-full lg:w-[80%] flex gap-3 overflow-x-scroll">
                        {districts.map(des=>
                        <Link href={`friends/${des}`} key={des} className="px-4 py-2 border rounded-full">{des}</Link>
                            )}
                    </div>
                </div>
                <div className="lg:w-[500px] w-full mx-auto">
                    {(posts == null) ? null
                        : posts.map(post => <Posts key={post.id} data={post} profile={profile} />)
                    }
                </div>
            </div>

        )
    }
}