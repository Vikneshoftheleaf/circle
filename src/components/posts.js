"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { updateDoc, doc, arrayUnion, arrayRemove, increment, onSnapshot, where, collection, query, QuerySnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useAuthContext } from "@/context/authcontext";
import { Icon } from "@iconify/react";

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

export default function Posts({ data, profile, view }) {

    const viewto = document.getElementById(view)
    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [commentText, setCommentText] = useState()
    const [postComments, setPostComments] = useState([])




    useEffect(() => {
        if (postComments != null) {
            console.log(postComments)
        }
    }, [postComments])

    useEffect(() => {

        const cref = collection(db, 'comments')
        const q = query(cref, where('postId', '==', data.id));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPostComments(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;

    }, [])

    useEffect(() => {


        if (viewto != null) {
            viewto.scrollIntoView({ behavior: "auto" });
        }

    }, [viewto])




    async function putLike() {
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(1),
            likedBy: arrayUnion(profile.uid)
        });
        console.log('done')
    }

    async function removeLike() {
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(-1),
            likedBy: arrayRemove(profile.uid)
        });

    }
    useEffect(() => {
        if (data.likedBy.includes(profile.uid)) {
            setLiked(true)
            console.log('worked')
        }
        else {
            setLiked(false)
        }


    }, [data.likes])

    async function addFollowing() {
        await updateDoc(doc(db, "user", data.author), {
            followers: increment(1),
            followedBy: arrayUnion(profile.uid)
        });

        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(1),
            followingBy: arrayUnion(data.author)
        });
        console.log("followed")
    }

    async function removeFollowing() {
        await updateDoc(doc(db, "user", data.author), {
            followers: increment(-1),
            followedBy: arrayRemove(profile.uid)
        });
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(-1),
            followingBy: arrayRemove(data.author)
        });
        console.log("Unfollowed")


    }

    useEffect(() => {
        if (profile.followingBy.includes(data.author)) {
            setFollowed(true)
            console.log('im following him')
        }
        else {
            setFollowed(false)
            console.log('im not following him')
        }
    }, [profile.following])

    async function addComment() {
        /* await updateDoc(doc(db, "comments", data.id), {
             values: {commentValues}
         });
         */
        await addDoc(collection(db, "comments"), {
            postId: data.id,
            cUserImg: profile.photoURL,
            cUserId: profile.uid,
            cUserName: profile.userName,
            cDisplayName: profile.displayName,
            commentText: commentText,
            cVerified: profile.verified
        });

    }


    return (
        <div id={data.id} className="p-4 flex flex-col gap-4 ">
            <div className="flex items-center gap-4">
                {data.authorImg ? <Image className="h-[35px] w-[35px] object-cover rounded-full" src={data.authorImg} height={50} width={50} alt="userImage"></Image> : <Icon className="h-[35px] w-[35px] object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />}
                <h1>{data.authorName}</h1>
                <div>
                    {(data.author == profile.uid)
                        ? null
                        : followed
                            ? <button onClick={() => removeFollowing()} className="px-2 py-1 border-2 text-red-950 rounded-md">Following</button>
                            : <button onClick={() => addFollowing()} className="px-2 py-1 bg-red-500 text-slate-100 rounded-md">Follow</button>
                    }
                </div>
            </div>
            <div className="object-cover">
                <Image className="h-[350px] w-[350px] object-cover" src={data.postPicURL} height={350} width={350} alt="posts"></Image>
            </div>
            <div>
                <h1 className="font-semibold text-base">{data.title}</h1>
            </div>
            <div className="flex items-center justify-center gap-12">
                <div className="flex gap-1">
                    <h1>{data.likes}</h1>
                    {liked
                        ? <button onClick={() => removeLike()}><Icon className="text-red-500" icon="mdi:heart" /></button>
                        : <button onClick={() => putLike()}><Icon icon="mdi:heart-outline" /></button>
                    }

                </div>
                <Drawer>
                    <DrawerTrigger>Comments</DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className={'flex justify-between items-center'}>
                            <DrawerTitle>Comments</DrawerTitle>
                            <DrawerClose>
                                <button>Cancel</button>
                            </DrawerClose>
                        </DrawerHeader>
                        <div>
                            {
                                (postComments == null) ? null
                                    : <div className="flex flex-col gap-4 h-[500px] overflow-y-scroll">
                                        {postComments.map(com =>

                                            <div key={com.id} className="w-full px-4 flex flex-col">
                                                <div className="flex gap-2 items-start">
                                                    <div>
                                                        {com.cUserImg
                                                            ? <Image src={com.cUserImg} height={24} width={24} className="h-[24px] w-[24px] object-cover rounded-full" alt="user Image"></Image>
                                                            : <Icon className="h-[24px] w-[24px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={24} width={24} />
                                                        }
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h1 className="flex gap-2 items-center font-semibold">
                                                            {com.cDisplayName}
                                                            {com.cVerified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}
                                                        </h1>
                                                        <p className="text-sm">{com.commentText}</p>


                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                            }

                        </div>

                        <DrawerFooter  className={'w-full fixed bottom-0 z-10'}>
                            <div className="w-full flex gap-2">
                                <input type="text" className="w-[80%] focus:outline-none" name="" id="" placeholder="Write a comment.." onChange={(e) => setCommentText(e.target.value)} />
                                <button className="bg-red-500 text-slate-100 px-4 py-2 rounded-md" onClick={() => addComment()}>Send</button>
                            </div>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <button>Share</button>
            </div>
        </div>
    )

}