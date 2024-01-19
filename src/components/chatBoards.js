import { db } from "@/firebase";
import { QuerySnapshot, doc, limit, onSnapshot, collection, query, where, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
export default function ChatBoards({ data, profile }) {
    const [otherSide, setotherSide] = useState()
    const [lastMsg, setlastmsg] = useState()
    const [unreadMsg, setunreadmsg] = useState();

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", (data.members[0] == profile.uid) ? data.members[1] : data.members[0]), (doc) => {
            const newData = doc.data()
            setotherSide(newData)
        });
        return unsub;

    }, [])

    useEffect(() => {


        const cref = collection(db, 'chats')
        const q = query(cref, where("roomId", '==', data.id), orderBy('time', 'desc'), limit(1));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setlastmsg(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;

    }, [])

    useEffect(() => {
        const cref = collection(db, 'chats')

        const q = query(cref,where('roomId','==',data.id), where("read", '==', false), where('to', '==', profile.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setunreadmsg(QuerySnapshot.size)
        })
    
          return unsubscribe;

    }, [])

    if (otherSide != null)
        return (
            <Link className="px-4 py-2 flex justify-between gap-4 items-center" href={`/account/message/${data.id}`}>

                <div className="flex gap-4">


                    <div>
                        {(otherSide.photoURL != null)
                            ? <Image alt="user profile" src={otherSide.photoURL} height={60} width={60} className="h-[60px] w-[60px] object-cover rounded-full"></Image>
                            : <Icon className="h-[50px] w-[50px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />
                        }
                    </div>
                    <div>
                        <h1 className="flex gap-1 items-center">{otherSide.userName} <span>{otherSide.isOnline?<Icon height={22} width={22} className="text-green-500"  icon="carbon:dot-mark" />:<Icon height={22} width={22} className="text-gray-300" icon="carbon:dot-mark" />}</span></h1>
                        <p className="text-gray-500 text-sm">{
                            (data.typing) ? 'Typing...'
                                : (lastMsg != null)
                                    ? lastMsg.map(m => <span key={m.id}>{m.chat}</span>)
                                    : null}</p>
                    </div>

                </div>

                <div>
                    {
                        (unreadMsg != null && unreadMsg > 0)
                        ? <p className="px-[10px] py-[2px] text-slate-100 bg-red-500 rounded-full">{unreadMsg}</p>
                        :null
                    }
                </div>
            </Link>
        )
}