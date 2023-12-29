"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDoc, collection, query, where, onSnapshot, QuerySnapshot, updateDoc, doc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import UserPosts from "@/components/userPosts";
import { db, auth } from "@/firebase";
export default function UserPage({ params }) {
    const [loading, setLoading] = useState(true)
    const [uData, setuData] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [userfound, setUserFound] = useState(false)
    const [followed, setFollowed] = useState(false);
    const { profile } = useAuthContext();

    const searchId = params.slug

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", searchId), (doc) => {
            const newData = doc.data()
            setuData(newData)
        });
        return unsub;
    }, [])


    useEffect(() => {
        const q = query(collection(db, "posts"), where("author", "==", searchId));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            //const cities = [];
            setUserPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        return unsubscribe

    }, [])


    useEffect(() => {
        if (uData) {
            if (uData.length != 0) {
                setUserFound(true)
                console.log(uData)
            }

        }
        setLoading(false)

    }, [uData])

    useEffect(() => {
        if (userPosts) {
            if (userPosts.length != 0) {
                console.log(userPosts)
            }

        }
    }, [userPosts])

    async function addFollowing() {
        await updateDoc(doc(db, "user", searchId), {
            followers: increment(1),
            followedBy: arrayUnion(profile.uid)
        });

        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(1),
            followingBy: arrayUnion(searchId)
        });
        console.log("followed")
    }

    async function removeFollowing() {
        await updateDoc(doc(db, "user", searchId), {
            followers: increment(-1),
            followedBy: arrayRemove(profile.uid)
        });
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(-1),
            followingBy: arrayRemove(searchId)
        });
        console.log("Unfollowed")


    }

    useEffect(() => {
        if (profile.followingBy.includes(searchId)) {
            setFollowed(true)
            console.log('im following him')
        }
        else {
            setFollowed(false)
            console.log('im not following him')
        }
    }, [profile.following])


    if (loading) {
        return (<><h1>Searching For User...</h1></>)
    }
    else {
        if (!userfound) {
            return (<><h1>No User Found!</h1></>)
        }
        else {

            return (
                <>
                    <div className="flex flex-col gap-4">

                        <div className="flex justify-start gap-4 items-center p-2">
                            <BackBtn />
                            <h1>{uData.displayName}</h1>
                        </div>

                        <div className="flex flex-col gap-4 ">


                            <div className="flex justify-center items-center ">
                                {uData.photoURL ? <Image className="rounded-full h-[100px] w-[100px] object-cover" src={uData.photoURL} height={100} width={100} alt="User"></Image>
                                    : 'U'}
                            </div>

                            <div className="text-center">
                                <h1>{uData.userName}</h1>
                            </div>

                            <div className="flex justify-center items-center gap-6">
                                <div className="flex flex-col justify-center items-center text-center">
                                    <h1>{uData.following}</h1>
                                    <h1>Following</h1>
                                </div>

                                <div className="flex flex-col justify-center items-center text-center">
                                    <h1>{uData.followers}</h1>
                                    <h1>Followers</h1>
                                </div>

                                <div className="flex flex-col justify-center items-center text-center">
                                    <h1>{uData.posts}</h1>
                                    <h1>Posts</h1>
                                </div>

                            </div>

                            <div className="flex w-full justify-center items-center px-4">
                                <div className="w-full">
                                    {followed
                                        ? <button onClick={() => removeFollowing()} className="w-full px-2 py-1 border-2 text-red-950 rounded-md">Following</button>
                                        : <button onClick={() => addFollowing()} className="w-full px-2 py-1 bg-red-500 text-slate-100 rounded-md">Follow</button>
                                    }
                                </div>                    </div>

                            <div className="text-center text-sm p-2">
                                <p>{uData.descrip}</p>
                            </div>

                        </div>


                        <div className="grid grid-cols-3 gap-1 p-4">
                            {userPosts.map(upost =>
                                <UserPosts key={upost.id} data={upost} />
                            )}
                        </div>
                    </div>
                </>
            )
        }
    }

}