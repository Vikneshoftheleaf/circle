"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import BackBtn from "@/components/backBtn";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import { db, auth } from "@/firebase";
import UserPosts from "@/components/userPosts";
export default function Profile() {
    const { profile } = useAuthContext();
    const [loading, setLoading] = useState(true)
    const { user } = useAuthContext();
    const [uData, setuData] = useState([])
    const [userPosts, setUserPosts] = useState([])

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", user.uid), (doc) => {
            const newData = doc.data()
            setuData(newData)
        });
        return unsub;

    }, [])


    useEffect(() => {
        const q = query(collection(db, "posts"), where("author", "==", user.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            //const cities = [];
            setUserPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            console.log(userPosts)
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        return unsubscribe

    }, [])


    useEffect(() => {
        if (uData) {
            console.log(uData)
        }

    }, [uData])

    useEffect(() => {
        if (userPosts) {
            console.log(userPosts)
            setLoading(false)
        }
    }, [userPosts])


if(loading)
{
    return(<><h1>Fetching User Profile</h1></>)
}
else{

    return (
        <>
            <div className="flex flex-col gap-4">
          
                <div className="flex justify-between items-center p-2">
                    <BackBtn />
                    <h1>{profile.displayName}</h1>
                    <Link className="text-2xl" href={'/account/settings'}><Icon icon="zondicons:dots-horizontal-triple" /></Link>
                </div>

                <div className="flex flex-col gap-4 ">


                    <div className="flex justify-center items-center ">
                        {profile.photoURL ? <Image className="rounded-full h-[100px] w-[100px] object-cover" src={profile.photoURL} height={100} width={100} alt="User"></Image>
                            : 'U'}
                    </div>

                    <div className="text-center">
                        <h1>{uData.userName}</h1>
                    </div>
 
                    <div className="flex justify-center items-center gap-6">
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>{profile.following}</h1>
                            <h1>Following</h1>
                        </div>
                        
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>{profile.followers}</h1>
                            <h1>Followers</h1>
                        </div>
                        
                        <div className="flex flex-col justify-center items-center text-center">
                            <h1>{profile.posts}</h1>
                            <h1>Posts</h1>
                        </div>
                    
                    </div>

                    <div className="flex justify-center items-center">
                        <button className="bg-red-500 text-slate-50 font-semibold px-6 py-2 rounded-sm">Follow</button>
                    </div>

                    <div className="text-center text-sm p-2">
                        <p>{uData.descrip}</p>
                    </div>
    
                </div>
  

                <div className="grid grid-cols-3 gap-1">
                    {userPosts.map(upost => 
                        <UserPosts key={upost.id} data={upost}/>
                    )}
                </div>
            </div>
        </>
    )
                }

}