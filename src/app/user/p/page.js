"use client";
import { collection, query, where, getDocs, getDoc, onSnapshot, orderBy, QuerySnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Posts from "@/components/posts";

import { useAuthContext } from "@/context/authcontext";
import { useSearchParams } from "next/navigation";
import BackBtn from "@/components/backBtn";

export default function ViewSearchUserPosts() {
    
    const { profile } = useAuthContext();
    const searchparam = useSearchParams();
    const view = searchparam.get('view');
    const searchUser = searchparam.get('user')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);
    const viewto = document.getElementById(view)

    useEffect(() => {
     
        if (viewto != null) {
            viewto.scrollIntoView({ behavior: 'instant' });
        }

    },[viewto])


    useEffect(() => {
        const cref = collection(db, 'posts')
        const q = query(cref, where("author", '==', searchUser));
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
                <BackBtn/>
                <div className="mt-5 mb-20">
                    {posts.map(post => 
                    
                    <Posts key={post.id} data={post} profile={profile} view={view}/>
                 
                    )}
                </div>
            </div>

        )
    }
}
