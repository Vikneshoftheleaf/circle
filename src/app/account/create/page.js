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
    const [image, setImage] = useState()
    const [username, setUsername] = useState()
    const [descrip, setdescrip] = useState();
    const fileInputRef = useRef();
    const metadata = {
        contentType: 'image/jpeg',
    };

    useEffect(() => {

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

    return (

        <>
            {(!image)
                ? <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleImageChange(e)} />
                : <Image src={URL.createObjectURL(image)} height={100} width={100} alt="User Profile" />}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <textarea name="" id="" cols="30" rows="10" onChange={(e) => setdescrip(e.target.value)} placeholder="write about you.."></textarea>
            <button onClick={() => createProfile()}>Create</button>
        </>
    )
}