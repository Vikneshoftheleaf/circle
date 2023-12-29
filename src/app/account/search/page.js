"use client"
import BackBtn from "@/components/backBtn"
import { useRouter } from "next/navigation"
export default function Search()
{
    const router = useRouter();
    return(
        <div>
            <div className="flex gap-2 items-center p-2">
                <BackBtn/>
                <input type="text" name="search" id="search" className="p-2 rounded-full w-full bg-red-50" placeholder="Search Videos"/>
            </div>
            <button onClick={()=>router.push('/user/VlPWybbdIhUfckbzYNjZ2eeZpQ03')}>go to profile</button>
        </div>
    )
}