"use client"
import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "@/context/authcontext"
import BackBtn from "@/components/backBtn"
import Image from "next/image"
import { createPost } from "@/functions/functions"
import { useRouter } from "next/navigation"
import { storage, db, auth } from "@/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, setDoc, updateDoc, and, serverTimestamp } from "firebase/firestore";
export default function Upload() {
    const { profile } = useAuthContext();
    const router = useRouter();
    const { user } = useAuthContext();
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);
    const fileInputRef = useRef(null);
    const [title, settitle] = useState(null)
    const [tags, settags] = useState(null)
    const [postId, setPostId] = useState(null)
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        if (selectedImage.name) {
            setImageName(selectedImage.name)
        }
        else {
            setImageName(null)
        }
    };

    const isEffectTriggered = useRef(false);
    useEffect(() => {
        // Trigger the file input click event only once
        if (!isEffectTriggered.current) {
            fileInputRef.current.click();
            isEffectTriggered.current = true;
        }
    }, []);

    function createPost(image, title, tags, uid, displayName, photoURL) {
        const metadata = {
            contentType: 'image/jpeg',
        };
        const newUserPostCount = Number(profile.posts) + 1;

        const storageRef = ref(storage, `posts/${image.name}`);

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, image, metadata).then(() => {

            getDownloadURL(ref(storage, `posts/${image.name}`))
                .then(async (url) => {

                    const docRef = await addDoc(collection(db, "posts"), {
                        postPicURL: url,
                        title: title,
                        tags: tags,
                        author: uid,
                        likes: 0,
                        authorName: displayName,
                        authorImg: photoURL,
                        likedBy: [],
                        postPicName: imageName,
                        postedAt: serverTimestamp()

                    });
                    await updateDoc(doc(db, "user", user.uid), {
                        posts: newUserPostCount
                    });
                    const id = docRef.id;
                    await setDoc(doc(db, "comments", id), {
                        values: []
                    });


                })


        });


    }



    return (
        <>
            {(!image) ? <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} /> :
                <div>
                    <div className="flex justify-between gap-2 items-center p-2">
                        <BackBtn />
                    </div>
                    <div className="flex gap-4 mx-5">
                        <div>
                            <Image src={URL.createObjectURL(image)} className="h-[50px] aspect-square object-cover" height={50} width={50} alt="uploaded Image" />
                        </div>
                        <div>
                            <textarea name="desc" id="" cols="30" rows="5" className="resize-none focus:outline-none" placeholder="Write Something" onChange={(e) => settitle(e.target.value)}></textarea>
                        </div>

                    </div>
                    <div className="flex flex-col gap-2 mx-5">
                        <h1 className="text-base font-semibold">Tags</h1>
                        <input type="text" name="tags" id="" placeholder="#Tags" className="focus:outline-none p-2" onChange={(e) => settags(e.target.value)} />
                    </div>

                    <div className="m-5">
                        <button className="w-full py-2 bg-red-500 text-xl font-semibold text-slate-100 rounded-sm" onClick={() => { createPost(image, title, tags, user.uid, profile.displayName, profile.photoURL); router.push('/account/vids') }}>Post</button>
                    </div>
                </div>

            }


        </>
    )
}