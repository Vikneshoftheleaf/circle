"use client";
import Vids from "@/components/vids";
import NavBar from "@/components/navbar";
import { collection, query, where, getDocs, getDoc, onSnapshot, orderBy, QuerySnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Posts from "@/components/posts";

import { useAuthContext } from "@/context/authcontext";
export default function Videos() {
    const { profile } = useAuthContext();

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

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
                <div className="mt-16 mb-24 w-full ">
                    {(posts == null) ? null
                        : posts.map(post => <Posts key={post.id} data={post} profile={profile} />)
                    }
                </div>
            </div>

        )
    }
}