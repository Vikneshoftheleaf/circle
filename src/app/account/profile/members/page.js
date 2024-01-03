"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Members() {
    /*const [membertype, setMemberType] = useState('follower')
    const searchparam = useSearchParams();
    const type = searchparam.get('type');
    useEffect(()=>{
        setMemberType(type)          
    },[])*/
    return (
        <Tabs defaultValue='follower' className="w-full">
            <TabsList className="w-full flex justify-center">
                <TabsTrigger value="follower">Followers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <TabsContent value="follower">Your followers</TabsContent>
            <TabsContent value="following">Your followings</TabsContent>
        </Tabs>

    )
}