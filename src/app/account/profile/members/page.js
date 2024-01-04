"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useAuthContext } from "@/context/authcontext";
import MemberList from "@/components/memberList";
import BackBtn from "@/components/backBtn";
export default function Members() {
    const [followers, setfollowers] = useState(null);
    const [following, setfollowing] = useState(null);
    const [members, setMembers] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuthContext();
    const { profile } = useAuthContext();
    const sp = useSearchParams();
    const memberView = sp.get('type')
    useEffect(() => {

        const unsub = onSnapshot(doc(db, "user", user.uid), (doc) => {
            const newData = doc.data();
            setMembers(newData)
            setLoading(false)
        });
        return unsub;

    }, [])

    useEffect(() => {
        if (followers != null) {
            console.log(followers)
        }
    }, [followers])

    useEffect(() => {
        if (following != null) {
            console.log(`following ${following}`)
        }
    }, [following])

    if (!loading)
        return (

            <div>
                <div>
                    <BackBtn/>
                </div>

                <Tabs defaultValue={`${memberView}`} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 justify-center items-center">
                        <TabsTrigger value="follower" className="text-xl font-semibold">Followers</TabsTrigger>
                        <TabsTrigger value="following" className="text-xl font-semibold">Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="follower">
                        {(members.followedBy != null)
                            ? members.followedBy.map(id => <MemberList key={id} id={id} profile={profile} type={'followers'} />
                            )
                            : null
                        }
                    </TabsContent>
                    <TabsContent value="following">
                        {(members.followingBy != null)
                            ? members.followingBy.map(fid => <MemberList key={fid} id={fid} profile={profile} type={'following'} />
                            )
                            : null
                        }

                    </TabsContent>
                </Tabs>

            </div>
        )
}