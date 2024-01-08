'use client';
import { useState, useEffect } from "react";
import { Timestamp, addDoc, collection, onSnapshot, doc, updateDoc, arrayRemove, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useAuthContext } from "@/context/authcontext";
import Image from "next/image";
import SpinLoading from "./spinLoading";
export default function MemberList({ id, profile, type, mode }) {
    const [idDetail, setIdDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFollowed, setIsFollowed] = useState(null)
    const [floading, setfloading] = useState(false)
    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", id), (doc) => {
            setIdDetail(doc.data())
        });
        return unsub;

    }, [profile])

    useEffect(() => {
        if (idDetail != null) {

            if (profile.followingBy.includes(id)) {
                setIsFollowed(true);
            }
            else {
                setIsFollowed(false);
            }
            setLoading(false)
        }


    }, [idDetail])

    async function addFollowing() {
        setfloading(true)
        await updateDoc(doc(db, "user", id), {
            followers: increment(1),
            followedBy: arrayUnion(profile.uid)
        })
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(1),
            followingBy: arrayUnion(id)
        })
        console.log("followed")

        await addDoc(collection(db, "notifications"), {
            notificationTo: id,
            nImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'is following you.',
            gotfollowed: profile.uid,
            nat: Timestamp.fromDate(new Date())

        }).then(()=> setfloading(false));

    }

    async function removeFollowing() {
        setfloading(true)
        await updateDoc(doc(db, "user", id), {
            followers: increment(-1),
            followedBy: arrayRemove(profile.uid)
        })
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(-1),
            followingBy: arrayRemove(id)
        })
        console.log("Unfollowed")
        await addDoc(collection(db, "notifications"), {
            notificationTo: id,
            nImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'unfollowed you.',
            nat: Timestamp.fromDate(new Date())

        }).then(()=> setfloading(false));


    }

    async function removeFollower() {
        await updateDoc(doc(db, "user", id), {
            following: increment(-1),
            followingBy: arrayRemove(profile.uid)
        });
        await updateDoc(doc(db, "user", profile.uid), {
            followers: increment(-1),
            followedBy: arrayRemove(id)
        });

    }

    if (!loading)
        return (
            <>
                <div className="w-full flex items-center justify-between px-4 py-2">

                    <Link href={`/user/${id}`} className="flex items-center gap-2">
                        <div>
                            {(idDetail.photoURL != null) ? <Image className="rounded-full h-[42px] aspect-square object-cover" src={idDetail.photoURL} height={42} width={42} alt="User"></Image>
                                : <Icon className="h-[42px] aspect-square text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={42} width={42} />

                            }
                        </div>
                        <div>
                            <h1 className="text-base font-semibold">{idDetail.userName}</h1>
                        </div>

                        <div>
                            {(idDetail.verified)
                                ? <Icon className="text-blue-500" icon="material-symbols:verified" />
                                : null
                            }
                        </div>


                    </Link>
                    {
                        (id == profile.uid)
                            ? null
                            :

                            <div className="flex items-center gap-4">
                                {
                                    (floading)
                                        ? <button className="h-full w-full px-4 py-2 text-base  font-semibold rounded-md"><SpinLoading h={4} w={4} /></button>
                                        : (isFollowed)
                                            ? <button onClick={() => removeFollowing()} className="px-4 py-2 bg-red-50 text-base  font-semibold rounded-md">Unfollow</button>
                                            : <button onClick={() => addFollowing()} className="px-4 py-2 bg-red-500 text-base text-slate-100 font-semibold rounded-md">Follow</button>
                                }

                                {
                                    (mode != 'search')
                                        ? (type == 'followers')
                                            ? <button onClick={() => removeFollower()} className="px-4 py-2 bg-red-50 text-base font-semibold rounded-md">Remove</button>
                                            : null
                                        : null
                                }
                            </div>
                    }

                </div>



            </>
        )
}