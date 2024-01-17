'use client';
import BackBtn from "@/components/backBtn";

import { db } from "@/firebase";
import { Icon } from "@iconify/react";

import { updateDoc, arrayUnion, doc, onSnapshot, getDoc, getDocs, docs, addDoc, collection, query, where, orderBy } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/authcontext";
import Image from "next/image";
export default function Chat({ params }) {

    const roomName = params.slug
    const [roomInfo, setroomInfo] = useState()
    const [msg, setmsg] = useState()
    const { profile } = useAuthContext()
    const [allMsg, setAllMsg] = useState(null)
    const msgInputRef = useRef()
    const [loading, setloading] = useState(true)
    const [otherSide, setOtherSide] = useState()
    const [scroll, setscroll] = useState()
    const parentDivRef = useRef()

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "messageRooms", roomName), (doc) => {
            const newData = doc.data()
            setroomInfo(newData)
        })
        return unsub;
    }, [])

    useEffect(() => {

        const cref = collection(db, 'chats')
        const q = query(cref, where("roomId", '==', roomName), orderBy('time', 'asc'));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setAllMsg(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;
    }, [])

    useEffect(() => {
        const cref = collection(db, 'chats')

        const rq = query(cref, where("roomId", '==', roomName), where('to', '==', profile.uid));

        getDocs(rq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    updateDoc(doc.ref, {
                        read: true
                    })


                });
            })
    }, [allMsg])

    useEffect(() => {
        if (roomInfo != null) {
            const unsub = onSnapshot(doc(db, "user", (roomInfo.members[0] == profile.uid) ? roomInfo.members[1] : roomInfo.members[0]), (doc) => {
                const newData = doc.data()
                setOtherSide(newData)
            })
            return unsub;

        }
    }, [roomInfo])

    useEffect(() => {
        if (otherSide != null) {
            setloading(false)
            setTimeout(() => {
                setscroll(true)
                
            }, 500);
        }
    }, [otherSide])

    useEffect(() => {
        if (allMsg != null) {
            var dummy = document.getElementById('msgContainer')
            if(dummy != null )
            {
                dummy.scrollTop = dummy.scrollHeight
            }
        }
          
    }, [scroll,allMsg])

   
    async function sendMsg() {
        await addDoc(collection(db, 'chats'), {
            roomId: roomName,
            from: profile.uid,
            to: (roomInfo.members[0] == profile.uid) ? roomInfo.members[1] : roomInfo.members[0],
            chat: msg,
            read: false,
            time: new Date()
        }).then(() => msgInputRef.current.value = '')
    }

    async function startTyping() {
        await updateDoc(doc(db, 'messageRooms', roomName), {
            typer: profile.uid,
            typing: true
        })

    }
    async function stopTyping() {
        await updateDoc(doc(db, 'messageRooms', roomName), {
            typing: false
        })

    }

    if (!loading)
        return (

            <div className="h-screen dark:bg-zinc-900 bg-white z-20 relative w-full">
                <div className=" h-[10%] bg-white w-full z-10 dark:bg-white/10 dark:backdrop-blur-lg top-0 flex items-center py-2">
                    <BackBtn />
                    <div className="flex gap-2 items-center">
                        {(otherSide.photoURL == null) 
                        ? <Icon className="h-[40px] w-[40px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={40} width={40} />
                            : <Image src={otherSide.photoURL} priority height={40} width={40} alt="user Profile" className="h-[40px] w-[40px] object-cover rounded-full"></Image>
                        }
                        <div className="h-full flex flex-col justify-between">
                            <h1 className="font-medium">{otherSide.userName}</h1>
                            <p className="text-sm">{(roomInfo.typer != profile.uid)
                                ? (roomInfo.typing) ? 'Typing...' : null
                                : null
                            }</p>
                        </div>
                    </div>
                </div>
                <div id="msgContainer" className="h-[70%] overflow-y-scroll py-4">
                    {(allMsg == null)
                        ? null
                        : allMsg.map(m =>
                            <div key={m.id} className="w-full px-4 py-2 snap-end">
                                {(m.from == profile.uid)
                                    ? <div className="w-full flex justify-end">
                                        <div className="flex flex-col items-end gap-0">
                                            <p className="px-4 py-2 bg-red-50 dark:bg-white/20 dark:backdrop-blur-sm rounded-full">{m.chat}</p>
                                            <p className="-mt-1">{(m.from == profile.uid) ? (m.read) ? <Icon height={20} width={20} className="text-blue-500" icon="solar:check-read-outline" /> : <Icon height={20} width={20} className="text-gray-500" icon="solar:check-read-outline" /> : null}</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="w-full flex justify-start">
                                        <p className="px-4 py-2 bg-red-50 dark:bg-white/20 dark:backdrop-blur-sm rounded-full" >{m.chat}</p>
                                    </div>
                                }
                            </div>
                        )
                    }
                </div>

                <div className="h-[10%] dark:bg-zinc-900 bg-white bottom-0 right-0 w-full flex items-center p-4">
                    <textarea ref={msgInputRef} onBlur={() => stopTyping()} onFocus={() => startTyping()} onChange={(e) => setmsg(e.currentTarget.value)} name="" id="" cols="30" rows="1" className="px-4 py-2 w-[85%]  resize-none rounded-md focus:outline-none" placeholder="Write Something"></textarea>
                    <button className="w-[15%] flex justify-center items-center" onClick={() => sendMsg()}><Icon icon="ion:send" /></button>
                </div>
            </div>
        )
}