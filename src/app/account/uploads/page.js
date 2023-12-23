"use client"
import { Icon } from "@iconify/react"
import BackBtn from "@/components/backBtn"
export default function Upload() {
    return (
        <div>
            <div className="flex justify-start gap-2 items-center p-2">
                <BackBtn/>
            </div>
            <div className="flex flex-col gap-2 p-2">
                <h1 className="font-semibold">Title</h1>
                <input autoFocus className="border-b-2 border-zinc-400 focus:outline-none p-2" type="text" name="title" id="title" />
                <h1 className="font-semibold">Video URL</h1>
                <input className="border-b-2 border-zinc-400 focus:outline-none p-2" type="url" name="url" id="url" />
                <h1 className="font-semibold">Description</h1>
                <textarea className="border-b-2 border-zinc-400 focus:outline-none p-2 resize-none" name="desc" id="desc" cols="20" rows="5"></textarea>
                <button className="flex justify-center gap-2 items-center bg-red-500 text-slate-50 py-2 rounded-sm"><h1>Publish</h1><Icon icon="material-symbols:send-outline" /></button>
            </div>

        </div>
    )
}