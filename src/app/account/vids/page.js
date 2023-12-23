"use client";
import Vids from "@/components/vids";
import NavBar from "@/components/navbar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useState } from "react";
import Posts from "@/components/posts";

export default function Videos() {
    /*const q = query(collection(db, "posts"), where("title", "==", "naruto"));
    const [postData, setPostData] = useState(null)
    const getdata = async () => {
        const querySnapshot = await getDocs(collection(db, 'posts'));

        querySnapshot.forEach((doc) => {
            setPostData(...postData,doc.data())
        });

    }

    getdata();

    return (
        <div>
            <Posts data={postData[0]} />
        </div>
    )*/
    return(

        <>
        <div>
            <NavBar/>
        </div>
        
        </>
    )
}