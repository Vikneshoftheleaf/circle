"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { updateDoc, doc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useAuthContext } from "@/context/authcontext";
import { Icon } from "@iconify/react";
export default function Posts({ data , profile}) {

    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false)
    let likes = data.likes;
    let followers = profile.followers;
    let following = profile.following;

    async function putLike(){
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(1),
            likedBy: arrayUnion(profile.uid)
        });
        console.log('done')
    }

    async function removeLike()
    {
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(-1),
            likedBy: arrayRemove(profile.uid)
        });

    }
    useEffect(()=>{
        if(data.likedBy.includes(profile.uid))
        {
            setLiked(true)
            console.log('worked')
        }
        else{
            setLiked(false)
        }
        

    },[data.likes])

    async function addFollowing()
    {
        await updateDoc(doc(db, "user", data.author), {
            followers:increment(1),
            followedBy: arrayUnion(profile.uid)
        });

        await updateDoc(doc(db, "user", profile.uid), {
            following:increment(1),
            followingBy: arrayUnion(data.author)
        });
        console.log("followed")
    }

    async function removeFollowing()
    {
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

    useEffect(()=>{
        if(profile.followingBy.includes(data.author))
        {
            setFollowed(true)
            console.log('im following him')
        }
        else{
            setFollowed(false)
            console.log('im not following him')      
        }
    },[profile.following])

  

    return (
        <div className="p-4 flex flex-col gap-4 ">
            <div className="flex items-center gap-4">
                {data.authorImg?<Image className="h-[35px] w-[35px] object-cover rounded-full" src={data.authorImg} height={50} width={50} alt="userImage"></Image>:null}
                <h1>{data.authorName}</h1>
                <div>
                    {followed
                    ?<button onClick={()=>removeFollowing()} className="px-2 py-1 border-2 text-red-950 rounded-md">Following</button>
                    :<button onClick={()=>addFollowing()} className="px-2 py-1 bg-red-500 text-slate-100 rounded-md">Follow</button>
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
                ?<button onClick={()=>removeLike()}><Icon className="text-red-500" icon="mdi:heart" /></button>
                :<button onClick={()=>putLike()}><Icon icon="mdi:heart-outline" /></button>
                }

                </div>
                <button>Comment</button>
                <button>Share</button>
            </div>
        </div>
    )
}