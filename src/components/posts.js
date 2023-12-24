"use client"
import Image from "next/image"
export default function Posts({ data }) {


    return (
        <div key={data.id} className="p-4 flex flex-col gap-4 ">
            <div className="flex items-center gap-4">
                {data.authorImg?<Image className="h-[35px] w-[35px] object-cover rounded-full" src={data.authorImg} height={50} width={50} alt="userImage"></Image>:null}
                <h1>{data.authorName}</h1>
                <button className="px-2 py-1 bg-red-500 text-slate-100 rounded-md">Follow</button>
            </div>
            <div className="object-cover">
                <Image className="h-[350px] w-[350px] object-cover" src={data.postPicURL} height={350} width={350} alt="posts"></Image>
            </div>
            <div>
                <h1 className="font-semibold text-base">{data.title}</h1>
            </div>
            <div className="flex items-center justify-center gap-12">
                <h1>{data.likes} Likes</h1>
                <button>Comment</button>
                <button>Share</button>
            </div>
        </div>
    )
}