"use client";
import Vids from "@/components/vids";
import NavBar from "@/components/navbar";
import { collection, query, where, getDocs, getDoc, onSnapshot, orderBy, QuerySnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Posts from "@/components/posts";


export default function Videos() {

    const [posts, setPosts] = useState([])
    useEffect(()=>{
        const cref = collection(db,'posts')
        const q = query(cref, orderBy("title","desc"));
        const unsubscribe = onSnapshot(q,(QuerySnapshot)=>{
            setPosts(QuerySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})))
        })
        return unsubscribe;

    },[])

    return(
        <div>
         <NavBar/>  
        <div className="my-20">
            {posts.map(post=><Posts data={post}/>)}
        </div>
        </div>
        
    )
}