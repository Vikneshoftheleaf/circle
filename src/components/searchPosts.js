import Image from "next/image"
export default function SearchPosts({data})
{
    return(
        <div id="data.id">
            <Image className="h-[100px] w-[100px] object-cover" src={data.postPicURL} height={200} width={200} alt="User Posts"/>
        </div>
    )
}