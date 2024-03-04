"use client"
import { useEffect, useRef, useState } from "react"
import { updateDoc, doc, getDoc, arrayUnion, arrayRemove, increment, onSnapshot, where, collection, query, QuerySnapshot, getDocs, addDoc, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth, storage } from "@/firebase";
import { Icon } from "@iconify/react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import SocialShareBtn from "./socialshareBtn";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Title } from "@radix-ui/react-dialog";
import MemberList from "./memberList";
import SpinLoading from "./spinLoading";


export default function Posts({ data, view, profile }) {

    const [liked, setLiked] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [commentText, setCommentText] = useState()
    const [postComments, setPostComments] = useState([])
    const [postUserProfile, setPostUserProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [floading, setfloading] = useState(false);
    const commentInputRef = useRef();
    const viewto = document.getElementById(view);
    const [likeAnimation, setLikeAnimation] = useState('scale-0')
    const [scrolled, setScrolled] = useState(false)
    const [doit, setdoit] = useState(null)


    // const timestamp = new Timestamp(seconds)

    useEffect(() => {


        if (viewto != null && scrolled == false) {
            viewto.scrollIntoView({ behavior: 'auto' });
            setScrolled(true)
            console.log("scrolled")
        }



    }, [doit])




    useEffect(() => {
        setTimeout(() => {
            setLikeAnimation('scale-0')
        }, 500)
    }, [likeAnimation])



    useEffect(() => {
        if (postComments != null) {
            console.log(postComments)
        }
    }, [postComments])





    useEffect(() => {

        const cref = collection(db, 'comments')
        const q = query(cref, where('postId', '==', data.id), orderBy('commentedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPostComments(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;

    }, [])



    async function putLike() {
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(1),
            likedBy: arrayUnion(profile.uid)
        });
        console.log('done')
        await addDoc(collection(db, "notifications"), {
            notificationTo: data.author,
            nImg: data.postPicURL,
            npImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'Liked your Post.',
            nat: Timestamp.fromDate(new Date())
        });

        new Notification('circle', { body: 'hello its circle', icon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fletter-t&psig=AOvVaw1PSVeEhU6b60pOyoMB_FkI&ust=1705774032142000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJD3qM6F6oMDFQAAAAAdAAAAABAD', image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fletter-t&psig=AOvVaw1PSVeEhU6b60pOyoMB_FkI&ust=1705774032142000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCJD3qM6F6oMDFQAAAAAdAAAAABAD' });

    }

    async function removeLike() {
        await updateDoc(doc(db, "posts", data.id), {
            likes: increment(-1),
            likedBy: arrayRemove(profile.uid)
        });
        await addDoc(collection(db, "notifications"), {
            notificationTo: data.author,
            nImg: data.postPicURL,
            npImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'Removed Like from your Post.',
            nat: Timestamp.fromDate(new Date())

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
        setfloading(true)
        await updateDoc(doc(db, "user", data.author), {
            followers: increment(1),
            followedBy: arrayUnion(profile.uid)
        });

        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(1),
            followingBy: arrayUnion(data.author)
        }).then(() => setfloading(false));
        console.log("followed")

        await addDoc(collection(db, "notifications"), {
            notificationTo: data.author,
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
        await updateDoc(doc(db, "user", data.author), {
            followers: increment(-1),
            followedBy: arrayRemove(profile.uid)
        });
        await updateDoc(doc(db, "user", profile.uid), {
            following: increment(-1),
            followingBy: arrayRemove(data.author)
        }).then(() => setfloading(false));
        console.log("Unfollowed")
        await addDoc(collection(db, "notifications"), {
            notificationTo: data.author,
            nImg: profile.photoURL,
            isVerified: profile.verified,
            read: false,
            nUserName: profile.userName,
            message: 'unfollowed you.',
            nat: Timestamp.fromDate(new Date())

        });


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

        await addDoc(collection(db, "comments"), {
            postId: data.id,
            cUserImg: profile.photoURL,
            cUserId: profile.uid,
            cUserName: profile.userName,
            cDisplayName: profile.displayName,
            commentText: commentText,
            cVerified: profile.verified,
            commentedAt: Timestamp.fromDate(new Date())
        }).then(() => commentInputRef.current.value = '');

        await addDoc(collection(db, "notifications"), {
            notificationTo: data.author,
            nImg: data.postPicURL,
            npImg: profile.photoURL,
            isVerified: profile.verified,
            commentText: commentText,
            read: false,
            nUserName: profile.userName,
            message: "commented on your post.",
            nat: Timestamp.fromDate(new Date())

        });


    }

    async function deletePost() {
        await deleteDoc(doc(db, "posts", data.id));
        console.log("posts deleted")
        await updateDoc(doc(db, 'user', data.author), {
            posts: increment(-1)
        })
        const desertRef = ref(storage, `posts/${data.postPicName}`);

        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log('post pic deleted')
        }).catch((error) => {
            console.log(error)
        })

        const commentRef = collection(db, 'comments')
        const cq = query(commentRef, where('postId', '==', data.id));
        getDocs(cq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    deleteDoc(doc.ref)
                        .then(() => {
                            console.log('all comments are deleted');
                        })

                });
            })

    }

    async function deleteComment(cid) {
        await deleteDoc(doc(db, 'comments', cid))
    }

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", data.author), (doc) => {
            const newData = doc.data();
            setPostUserProfile(newData);
            setLoading(false)
            setTimeout(() => {
                setdoit(true)

            }, 100)
        });
        return unsub;


    }, [])

    if (!loading)
        return (
            <div id={data.id} className="flex mx-auto flex-col gap-2 lg:w-[500px] py-6 ">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2 ">
                        <Link href={`/user/${data.author}`} >
                            {(postUserProfile.photoURL != null) ? <Image priority className="h-[35px] w-[35px] object-cover rounded-full" src={postUserProfile.photoURL} height={50} width={50} alt="userImage"></Image> : <Icon className="h-[35px] w-[35px] object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />}
                        </Link>
                        <Link href={`/user/${data.author}`} className="flex gap-2 items-center">
                            <h1 className="text-base font-medium">{postUserProfile.userName}</h1>
                            {postUserProfile.verified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}
                        </Link>
                        <div>
                            {(data.author == profile.uid)
                                ? null
                                : (floading)
                                    ? <button className="px-4 py-1 text-red-950 rounded-md"><SpinLoading h={4} w={4} /></button>
                                    : followed
                                        ? <button onClick={() => removeFollowing()} className="px-4 py-1 dark:text-slate-100 text-red-950 rounded-md font-medium">Following</button>
                                        : <button onClick={() => addFollowing()} className="px-4 py-1 text-red-500 rounded-md font-medium">Follow</button>
                            }
                        </div>

                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {(data.author == profile.uid)
                                ? <Icon icon="zondicons:dots-horizontal-triple" height={18} width={18} />
                                : null}

                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem><button onClick={() => deletePost()}>Delete</button></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <button onDoubleClick={() => { if (!liked) { putLike(); setLikeAnimation('scale-100') } else { removeLike() } }} className="py-2 relative w-full h-full" >
                    <Icon className={`text-white drop-shadow-xl absolute right-1/3 top-1/3 transition duration-300 ease-in-out ${likeAnimation}`} icon="mdi:heart" height={150} width={150} />
                    <Image className=" w-full aspect-square object-contain " src={data.postPicURL} height={350} width={350} alt="posts" priority></Image>
                </button>

                <div className="flex items-center px-4 ">
                    <div className="flex gap-4">
                        {liked
                            ? <button onClick={() => removeLike()}><Icon className="text-red-500" icon="mdi:heart" height={32} width={32} /></button>
                            : <button onClick={() => putLike()}><Icon icon="mdi:heart-outline" height={32} width={32} /></button>
                        }
                        <Drawer >
                            <DrawerTrigger>
                                <Icon icon="iconamoon:comment" height={32} width={32} />
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className={'flex justify-center items-center border-b-2'}>
                                    <DrawerTitle><h1 className="text-xl font-semibold">Comments</h1></DrawerTitle>
                                    {/*<DrawerClose>
                                    <button>Cancel</button>
                                </DrawerClose>*/}
                                </DrawerHeader>
                                <div>
                                    {
                                        (postComments == null)
                                            ? null

                                            : <div className="flex flex-col gap-4 h-[500px] overflow-y-scroll pt-4">
                                                {postComments.map(com =>

                                                    <div key={com.id} className="w-full px-4  ">

                                                        <div className="flex  justify-between gap-2 ">
                                                            <div className="flex gap-4">
                                                                {com.cUserImg
                                                                    ? <Image priority src={com.cUserImg} height={42} width={42} className="h-[42px] aspect-square object-cover rounded-full" alt="user Image"></Image>
                                                                    : <Icon className="h-[42px] aspect-square text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={42} width={42} />
                                                                }
                                                                <div>
                                                                    <h1 className="flex gap-2 items-center justify-between font-semibold">
                                                                        <div className="flex gap-2 items-center text-sm font-semibold">
                                                                            {com.cUserName}
                                                                            {com.cVerified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}
                                                                        </div>
                                                                    </h1>
                                                                    <p className="text-base">{com.commentText}</p>

                                                                </div>
                                                            </div>

                                                            <div className="col-span-8 flex flex-col">
                                                                {(com.cUserId != profile.uid) ? null
                                                                    : <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Icon icon="zondicons:dots-horizontal-triple" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent>
                                                                            <DropdownMenuItem><button onClick={() => deleteComment(com.id)}>Remove</button></DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                }

                                                            </div>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                    }

                                </div>

                                <DrawerFooter className={'w-full fixed bottom-0 z-10 mb-[-5px]'}>
                                    <div className="w-full flex justify-between items-center gap-2 ">
                                        <div className="flex gap-4 items-center">
                                            <div className="">
                                                {(profile.photoURL)
                                                    ? <Image priority src={profile.photoURL} className="h-[42px] aspect-square object-cover rounded-full" height={42} width={42} alt="user Image"></Image>
                                                    : null
                                                }
                                            </div>
                                            <textarea ref={commentInputRef} type="text" className="dark:bg-transparent focus:outline-none resize-none p-1 " rows={1} name="" id="" placeholder="Write a comment.." onChange={(e) => setCommentText(e.target.value)} ></textarea>

                                        </div>
                                        <button className=" px-4 py-2 rounded-md" onClick={() => addComment()}><Icon icon="ic:round-send" height={22} width={22} /></button>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>


                        <Drawer >
                            <DrawerTrigger>
                                <Icon icon="mingcute:send-plane-line" height={32} width={32} />
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className={'flex justify-center items-center border-b-2'}>
                                    <DrawerTitle><h1 className="text-xl font-semibold">Share</h1></DrawerTitle>

                                </DrawerHeader>

                                <div className="h-full p-4 w-full flex justify-center items-start">
                                    <SocialShareBtn url={`${process.env.NEXT_PUBLIC_URL}/user/p?user=${data.author}&view=${data.id}`} />

                                </div>


                            </DrawerContent>
                        </Drawer>

                    </div>

                </div>

                <div className="flex flex-col gap-0">
                    <div>
                        <Drawer>
                            <DrawerTrigger>
                                <h1 className="px-4 font-semibold">{(data.likes <= 1) ? `${data.likes} like` : (data.likes > 2) ? `Liked By ${data.likes} and others` : `${data.likes} Likes`}</h1>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Likes</DrawerTitle>
                                </DrawerHeader>
                                <div>
                                    {(data.likedBy != null)
                                        ? <div>
                                            {data.likedBy.map(id => <MemberList key={id} profile={profile} id={id} type={'following'} />)}

                                        </div>
                                        : null
                                    }
                                </div>

                            </DrawerContent>
                        </Drawer>

                    </div>
                    <div className="px-4">
                        <h1 className="text-base"><span className="font-semibold text-base">{postUserProfile.userName}</span> {data.title}</h1>
                    </div>
                    <div className="px-4">
                        <Drawer >
                            <DrawerTrigger>
                                <p className="text-slate-500">{(postComments.length > 2) ? `View all ${postComments.length} comments` : 'View all comments'}</p>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className={'flex justify-center items-center border-b-2'}>
                                    <DrawerTitle><h1 className="text-xl font-semibold">Comments</h1></DrawerTitle>
                                    {/*<DrawerClose>
                                    <button>Cancel</button>
                                </DrawerClose>*/}
                                </DrawerHeader>
                                <div>
                                    {
                                        (postComments == null)
                                            ? null

                                            : <div className="flex flex-col gap-4 h-[500px] overflow-y-scroll pt-4">
                                                {postComments.map(com =>

                                                    <div key={com.id} className="w-full px-4  ">

                                                        <div className="flex  justify-between gap-2 ">
                                                            <div className="flex gap-4">
                                                                {com.cUserImg
                                                                    ? <Image priority src={com.cUserImg} height={42} width={42} className="h-[42px] aspect-square object-cover rounded-full" alt="user Image"></Image>
                                                                    : <Icon className="h-[42px] aspect-square text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={42} width={42} />
                                                                }
                                                                <div>
                                                                    <h1 className="flex gap-2 items-center justify-between font-semibold">
                                                                        <div className="flex gap-2 items-center text-sm font-semibold">
                                                                            {com.cUserName}
                                                                            {com.cVerified ? <Icon className="text-blue-500" icon="material-symbols:verified" /> : null}
                                                                        </div>
                                                                    </h1>
                                                                    <p className="text-base">{com.commentText}</p>

                                                                </div>
                                                            </div>

                                                            <div className="col-span-8 flex flex-col">
                                                                {(com.cUserId != profile.uid) ? null
                                                                    : <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Icon icon="zondicons:dots-horizontal-triple" />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent>
                                                                            <DropdownMenuItem><button onClick={() => deleteComment(com.id)}>Remove</button></DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                }

                                                            </div>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                    }

                                </div>

                                <DrawerFooter className={'w-full fixed bottom-0 z-10 mb-[-5px]'}>
                                    <div className="w-full flex justify-between items-center gap-2 ">
                                        <div className="flex gap-4 items-center">
                                            <div className="">
                                                {(profile.photoURL)
                                                    ? <Image priority src={profile.photoURL} className="h-[42px] aspect-square object-cover rounded-full" height={42} width={42} alt="user Image"></Image>
                                                    : null
                                                }
                                            </div>
                                            <textarea ref={commentInputRef} type="text" className="dark:bg-transparent focus:outline-none resize-none p-1 " rows={1} name="" id="" placeholder="Write a comment.." onChange={(e) => setCommentText(e.target.value)} ></textarea>

                                        </div>
                                        <button className=" px-4 py-2 rounded-md" onClick={() => addComment()}><Icon icon="ic:round-send" height={22} width={22} /></button>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>


                </div>
            </div>
        )

}
