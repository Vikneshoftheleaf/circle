"use client"
import Image from "next/image"
export default function Posts({data})
{
    return(
        <div>
            <Image src={data.postPicURL} height={500} width={500} alt="posts"></Image>
            <h1>{data.title}</h1>
        </div>
    )
}