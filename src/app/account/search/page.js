"use client"
import { Icon } from "@iconify/react"
export default function Search()
{
    return(
        <div>
            <div className="flex gap-2 items-center p-2">
                <button onClick={() => history.back()}>
                    <Icon icon="ep:back" />
                </button>
                <input type="text" name="search" id="search" className="p-2 rounded-full w-full bg-red-50" placeholder="Search Videos"/>
            </div>
        </div>
    )
}