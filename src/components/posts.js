"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { updateDoc, doc, arrayUnion, arrayRemove, increment, onSnapshot } from "firebase/firestore";
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
    const [commentValues, setCommentValues] = useState({
        commentId: profile.id,
        commentPic: profile.photoURL,
        commentName: profile.displayName,
        commentVerified: profile.verified,
        commentText: commentText
})
    
    

    useEffect(() => {
        if (postComments != null) {
            console.log(postComments)
        }
    }, [postComments])

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "comments", data.id), (doc) => {
            const newData = doc.data()
            setPostComments(newData)
            console.log("data are fetched")
        });
        return unsub;

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
        await updateDoc(doc(db, "comments", data.id), {
            values: {commentValues}
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
                                    : <div>

                                        {/*postComments.comments.map(com => <h1 key={com.commentName}>{com.commentText}</h1> )*/}
                                    </div>

                            }

                        </div>

                        <DrawerFooter className={'w-full'}>
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