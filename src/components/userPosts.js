import Image from "next/image"
export default function UserPosts({data})
{
    return(
        <div id="data.id">
            <Image priority className="w-full aspect-square object-cover" src={data.postPicURL} height={120} width={120} alt="User Posts"/>
        </div>
    )
}