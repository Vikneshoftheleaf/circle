"use client";
import { useEffect, useRef, useState } from "react"
import Image from "next/image";
import { storage, db, auth } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "@/context/authcontext";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
export default function Create() {
    const [uData, setuData] = useState();
    const router = useRouter();
    const { user } = useAuthContext();
    const { profile } = useAuthContext();
    const [image, setImage] = useState()
    const [username, setUsername] = useState()
    const [descrip, setdescrip] = useState();
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef();
    const metadata = {
        contentType: 'image/jpeg',
    };

    useEffect(() => {
        if (profile.userName) {
            router.push('/account/profile')
        }
        setLoading(false)

    }, [])

    /* useEffect(() => {
 
         const unsub = onSnapshot(doc(db, "user", user.uid), (doc) => {
             const newData = doc.data()
             setuData(newData)
         });
         return unsub;
 
     }, [])
     useEffect(() => {
         if (uData) {
 
             if (uData.userName != null) {
                 router.push('/account/profile')
             }
         }
     }, [uData])
 
 */

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };



    function createProfile() {
        const storageRef = ref(storage, `user/${user.uid}`);

        uploadBytes(storageRef, image, metadata).then(() => {

            getDownloadURL(ref(storage, `user/${user.uid}`))
                .then(async (url) => {

                    await updateDoc(doc(db, "user", user.uid), {
                        userName: username,
                        descrip: descrip,
                        photoURL: url
                    });
                    router.push('/account/profile')
                    console.log("updated")

                })

        });


    }
    

    


    function clickGetImg() {
        fileInputRef.current.click();
    }
    if (loading) {
        return (<h1>Loading bro..</h1>)
    }
    else{
    return (

        <>
            <div className="flex flex-col justify-center items-center gap-4 p-4">
                <h1 className="text-2xl font-bold">Create Your Profile</h1>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} />
                <button className="border-2 rounded-full h-[100px] w-[100px] object-cover" onClick={() => clickGetImg()}>
                    {(!image)
                        ? <h1>U</h1>
                        : <Image className="h-[100px] w-[100px] object-cover rounded-full" src={URL.createObjectURL(image)} style={{ width: '100px', height: '100px' }} height={100} width={100} alt="User Profile" />
                    }

                </button>
                <div className="flex flex-col w-full gap-4">
                    <input type="text" placeholder="Username" className="focus:outline-none" onChange={(e) => setUsername(e.target.value)} />
                    <textarea name="" id="" cols="30" rows="10" className="focus:outline-none" onChange={(e) => setdescrip(e.target.value)} placeholder="write about you.."></textarea>
                </div>

                <button className="w-full bg-red-500 py-2 text-slate-100 rounded-md" onClick={() => createProfile()}>Create</button>

            </div>

        </>
    )

                }
}