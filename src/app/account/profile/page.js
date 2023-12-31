"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import { db, auth } from "@/firebase";
import UserPosts from "@/components/userPosts";
import { useRouter } from "next/navigation";
export default function Profile() {
    const router = useRouter();
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
            //console.log("Current cities in CA: ", cities.join(", "));
        });
        return unsubscribe

    }, [])


    useEffect(() => {
        if (uData.length != 0) {
            console.log(uData)
        }

    }, [uData])

    useEffect(() => {
        if (userPosts.length != 0) {
            console.log(userPosts)
        }
        setLoading(false)
    }, [userPosts])


    if (loading) {
        return (<><h1>Fetching User Profile</h1></>)
    }
    else {

        return (
            <>
                <div className="flex flex-col gap-2">

                    <div className="flex items-center m-4 justify-between">
                        <div className="flex gap-2 items-center" >
                            <h1 className="font-bold">{profile.displayName}</h1>
                            <h1>{profile.verified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}</h1>
                        </div>

                        <Link className="text-2xl" href={'/account/settings'}><Icon icon="zondicons:dots-horizontal-triple" height={24} width={24} /></Link>
                    </div>

                    <div className="flex justify-between gap-4 px-4">


                        <div className="flex justify-center items-center relative ">
                            <div className="">
                                {(profile.photoURL != null) ? <Image className="rounded-full h-[80px] w-[80px] object-cover" src={profile.photoURL} height={80} width={80} alt="User"></Image>
                                    : <Icon className="h-[100px] w-[100px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />

                                }

                            </div>

                        </div>


                        <div className="flex justify-center items-center gap-6">
                            <div className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{profile.posts}</h1>
                                <h1 className="text-base">Posts</h1>
                            </div>



                            <div className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{profile.followers}</h1>
                                <h1 className="text-base">Followers</h1>
                            </div>

                            <div className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{profile.following}</h1>
                                <h1 className="text-base">Following</h1>
                            </div>



                        </div>


                    </div>

                    <div className="flex gap-2  font-semibold text-base px-4">
                        <h1>{profile.userName}</h1>
                    </div>

                    <div className=" text-sm px-4">
                        <p>{profile.descrip}</p>
                    </div>

                    <div className="w-full px-4 text-center">
                        <Link href={'/account/profile/edit'} className="bg-red-50 rounded-md font-semibold text-base py-2 w-full">Edit Profile</Link>
                    </div>

                    <hr className="mt-4"/>

                    <div className="grid grid-cols-3 gap-1">
                        {userPosts.map(upost =>
                            <Link key={upost.id} href={`/account/profile/p?view=${upost.id}`}>
                                <UserPosts data={upost} />
                            </Link>
                        )}
                    </div>
                </div>
            </>
        )
    }

}