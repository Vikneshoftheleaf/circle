"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addDoc,Timestamp, getDoc, collection, query, where, onSnapshot, QuerySnapshot, updateDoc, doc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import UserPosts from "@/components/userPosts";
import { db, auth } from "@/firebase";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import SocialShareBtn from "@/components/socialshareBtn";
import SpinLoading from "@/components/spinLoading";


export default function UserPage({ params }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [uData, setuData] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [userfound, setUserFound] = useState(false)
    const [followed, setFollowed] = useState(false);
    const [floading, setfloading] = useState(false)
    const { profile } = useAuthContext();

    const searchId = params.slug

    useEffect(() => {
        if (searchId == profile.uid) {
            router.push('/account/profile')
        }
    }, [])

    useEffect(() => {
        if (searchId.length > 0) {
            const unsub = onSnapshot(doc(db, "user", searchId), (doc) => {
                const newData = doc.data()
                setuData(newData)
            });
            return unsub;

        }

    }, [])


    useEffect(() => {
        if (searchId.length > 0) {
            const q = query(collection(db, "posts"), where("author", "==", searchId));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                //const cities = [];
                setUserPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                //console.log("Current cities in CA: ", cities.join(", "));
            });
            return unsubscribe
        }

    }, [])


    useEffect(() => {
        if (uData) {
            if (uData.length != 0) {
                setUserFound(true)
                console.log(uData)
            }
            setLoading(false)

        }

    }, [uData])

    useEffect(() => {
        if (userPosts) {
            if (userPosts.length != 0) {
                console.log(userPosts)
            }

        }
    }, [userPosts])

    async function addFollowing() {
        setfloading(true)
        await updateDoc(doc(db, "user", searchId), {
            followers: increment(1),
            followedBy: arrayUnion(profile.uid)
        })
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(1),
            followingBy: arrayUnion(searchId)
        }).then(()=> setfloading(false))
        console.log("followed")

        await addDoc(collection(db, "notifications"), {
            notificationTo: searchId,
            nImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'is following you.',
            gotfollowed: profile.uid,
            nat: Timestamp.fromDate(new Date())

        });

    }

    async function removeFollowing() {
        setfloading(true)
        await updateDoc(doc(db, "user", searchId), {
            followers: increment(-1),
            followedBy: arrayRemove(profile.uid)
        })
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(-1),
            followingBy: arrayRemove(searchId)
        }).then(()=> setfloading(false));
        console.log("Unfollowed")
        await addDoc(collection(db, "notifications"), {
            notificationTo: searchId,
            nImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'unfollowed you.',
            nat: Timestamp.fromDate(new Date())

        });


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


        return (
            <>
            
                <div className="flex flex-col gap-2 w-full">

                    <div className="flex items-center m-4 justify-between">
                        <div className="flex gap-1 items-center" >
                            <BackBtn/>
                            <h1 className="font-bold text-xl">{uData.displayName}</h1>
                            <h1>{uData.verified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}</h1>
                        </div>

                        {/*<Link className="text-2xl" href={'/account/settings'}><Icon icon="zondicons:dots-horizontal-triple" height={24} width={24} /></Link>*/}
                    </div>

                    <div className="flex justify-between gap-4 px-4">


                        <div className="flex justify-center items-center relative ">


                            <Dialog>
                                <DialogTrigger>
                                    <div className="">
                                        {(uData.photoURL != null) ? <Image className="rounded-full h-[80px] w-[80px] object-cover" src={uData.photoURL} height={80} width={80} alt="User"></Image>
                                            : <Icon className="h-[100px] w-[100px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />

                                        }

                                    </div>
                                </DialogTrigger>
                                <DialogContent className="backdrop-blur-sm border-none bg-white/90">
                                    <DialogHeader>
                                        <DialogTitle></DialogTitle>
                                        <DialogDescription className="flex justify-center items-center">

                                            {
                                                (uData.photoURL) ? <Image className="h-[200px] aspect-square" src={uData.photoURL} height={200} width={200} alt="user profile"></Image>

                                                    : <Icon className="h-[200px] aspect-square text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={200} width={200} />

                                            }
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>


                        </div>


                        <div className="flex justify-center items-center gap-8">
                            <div className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{uData.posts}</h1>
                                <h1 className="text-base">Posts</h1>
                            </div>



                            <Link href={`/user/members?id=${searchId}&type=follower`} className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{uData.followers}</h1>
                                <h1 className="text-base">Followers</h1>
                            </Link>

                            <Link href={`/user/members?id=${searchId}&type=following`} className="flex flex-col justify-center items-center text-center">
                                <h1 className="text-lg font-bold">{uData.following}</h1>
                                <h1 className="text-base">Following</h1>
                            </Link>



                        </div>


                    </div>

                    <div className="flex gap-2  font-semibold text-base px-4">
                        <h1>{uData.userName}</h1>
                    </div>

                    <div className=" text-sm px-4">
                        <p>{uData.descrip}</p>
                    </div>

                    <div className="w-full px-4 text-center grid grid-cols-10">
                        <div className="col-span-8">
                            {
                                (floading)
                                ?<button className=" w-full rounded-md font-semibold text-base py-2 flex justify-center items-center "><SpinLoading h={6} w={6}/></button>
                                :followed
                                ? <button onClick={() => removeFollowing()} className=" w-full dark:bg-white/10 dark:backdrop-blur-sm bg-red-50 rounded-md font-semibold text-base py-2 ">Following</button>
                              : <button onClick={() => addFollowing()} className="  w-full bg-red-500 rounded-md font-semibold text-base text-slate-100 py-2 ">Follow</button>

                            }
                            


                        </div>
                        <div className="col-span-2">
                            <Drawer >
                                <DrawerTrigger className="rounded-md dark:bg-white/10 dark:backdrop-blur-sm bg-red-50 h-full px-2">
                                <Icon icon="heroicons-outline:share" height={32} width={32} />
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader className={'flex justify-center items-center border-b-2'}>
                                        <DrawerTitle><h1 className="text-xl font-semibold">Share</h1></DrawerTitle>

                                    </DrawerHeader>

                                    <div className="h-full p-4 w-full flex justify-center items-start">
                                        <SocialShareBtn url={`${process.env.NEXT_PUBLIC_URL}/user/${uData.uid}`}/>

                                    </div>

                                    <DrawerFooter className={'w-full fixed bg-white bottom-0 z-10 mb-[-5px]'}>

                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>

                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="grid grid-cols-3 gap-1">
                        {userPosts.map(upost =>
                            <Link key={upost.id} href={`/user/p?user=${searchId}&view=${upost.id}`}>
                                <UserPosts data={upost} />
                            </Link>
                        )}
                    </div>
                </div>
            </>
        )
    }


}
