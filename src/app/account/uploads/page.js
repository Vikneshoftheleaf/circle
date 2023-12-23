"use client"
import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "@/context/authcontext"
import BackBtn from "@/components/backBtn"
import Image from "next/image"
import { createPost } from "@/functions/functions"
import { useRouter } from "next/navigation"
export default function Upload() {
    const router = useRouter();
    const {user} = useAuthContext();
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [title, settitle] = useState(null)
    const [tags, settags] = useState(null)
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const isEffectTriggered = useRef(false);
    useEffect(() => {
        // Trigger the file input click event only once
        if (!isEffectTriggered.current) {
            fileInputRef.current.click();
            isEffectTriggered.current = true;
        }
    }, []);
    return (
        <>
            {(!image) ? <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} /> :
                <div>
                    <div className="flex justify-between items-center gap-2 items-center p-2">
                        <BackBtn />
                    </div>
                    <div className="flex gap-4 mx-5">
                        <div>
                            <Image src={URL.createObjectURL(image)} height={350} width={350} alt="uploaded Image" />
                        </div>
                        <div>
                            <textarea name="desc" id="" cols="30" rows="5" className="resize-none focus:outline-none" placeholder="Write Something" onChange={(e)=>settitle(e.target.value)}></textarea>
                        </div>

                    </div>
                    <div className="flex flex-col gap-2 mx-5">
                        <h1>Tags</h1>
                        <input type="text" name="tags" id="" placeholder="#Tags" className="focus:outline-none p-2" onChange={(e)=>settags(e.target.value)}/>
                    </div>

                    <div className="m-5">
                        <button className="w-full py-2 bg-red-500 text-xl text-semibold text-slate-100 rounded-sm" onClick={()=>{createPost(image,title,tags,user.uid);router.push('/account/vids')}}>Post</button>
                    </div>
                </div>

            }


        </>
    )
}