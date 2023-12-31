import Image from "next/image"
export default function SearchPosts({data})
{
    return(
        <div id="data.id">
            <Image className="w-full aspect-square object-cover" src={data.postPicURL} height={120} width={120} alt="User Posts"/>
        </div>
    )
}