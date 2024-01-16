'use client';
import BackBtn from "@/components/backBtn";

import { db } from "@/firebase";

import { updateDoc, arrayUnion, doc, onSnapshot, getDoc, getDocs, docs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/authcontext";
export default function Chat({ params }) {

    const roomName = params.slug

    const [msg, setmsg] = useState()

    const { profile } = useAuthContext()

    const [allMsg, setAllMsg] = useState()

    const msgInputRef = useRef()

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "messageRooms", roomName), (doc) => {
            const newData = doc.data()
            setAllMsg(newData)
        })
        return unsub;
    }, [])

    useEffect(() => {
        if (allMsg != null) {

            const sun = async () =>{
            const documentRef = doc(db, 'messageRooms', roomName);
            const documentSnapshot = await getDoc(documentRef);

            if (documentSnapshot.exists()) {
                // Get the current array from the document
                const currentArray = documentSnapshot.data().chats || [];

                // Find the object within the array that you want to update
                const updatedArray = currentArray.map((item) => {
                    if (item.sendBy != profile.uid && item.read == false) {
                        // Update the value you want to change
                        return { ...item, read: true };
                    }
                    return item;
                });

                // Update the document with the modified array
                updateDoc(documentRef, { chats: updatedArray });
            }
        }
        return sun
        }
    }, [allMsg])

    async function sendMsg() {
        await updateDoc(doc(db, 'messageRooms', roomName),
            {
                chats: arrayUnion(
                    {
                        msg: msg,
                        read: false,
                        sendBy: profile.uid,
                        time: new Date()
                    }
                )
            }).then(() => { msgInputRef.current.value = '' })

    }
    return (

        <div className="h-screen dark:bg-zinc-900 bg-white z-20 relative w-full">
            <div>
                <BackBtn />
            </div>
            <div className="h-[80%] overflow-y-scroll">
                {(allMsg == null)
                    ? null
                    : allMsg.chats.map(m =>
                        <div key={m.time} className="w-full px-4 py-2">
                            {(m.sendBy == profile.uid)
                                ? <div className="w-full flex justify-end">
                                    <p className="p-2 bg-red-50 dark:bg-white/20 dark:backdrop-blur-sm rounded-md">{m.msg}</p>
                                </div>
                                : <div className="w-full flex justify-start">
                                    <p className="p-2 bg-red-50 dark:bg-white/20 dark:backdrop-blur-sm rounded-md">{m.msg}</p>
                                </div>
                            }
                        </div>
                    )
                }
            </div>

            <div className="absolute bottom-0 right-0 w-full flex p-4">
                <textarea ref={msgInputRef} onChange={(e) => setmsg(e.currentTarget.value)} name="" id="" cols="30" rows="1" className="px-4 py-2 w-[80%]  resize-none rounded-md focus:outline-none" placeholder="Write Something"></textarea>
                <button className="w-[20%]" onClick={() => sendMsg()}>Send</button>
            </div>
        </div>
    )
}