"use client"
import BackBtn from "@/components/backBtn"
export default function Search()
{
    return(
        <div>
            <div className="flex gap-2 items-center p-2">
                <BackBtn/>
                <input type="text" name="search" id="search" className="p-2 rounded-full w-full bg-red-50" placeholder="Search Videos"/>
            </div>
        </div>
    )
}