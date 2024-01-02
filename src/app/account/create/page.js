"use client";
import { useEffect, useRef, useState } from "react"
import Image from "next/image";
import { storage, db, auth } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "@/context/authcontext";
import { doc, updateDoc, onSnapshot, where, query, collection, QuerySnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
export default function Create() {
    const [uData, setuData] = useState();
    const router = useRouter();
    const { user } = useAuthContext();
    const { profile } = useAuthContext();
    const [image, setImage] = useState(null)
    const [username, setUsername] = useState(null)
    const [nameTaken, setNameTaken] = useState(null)
    const [descrip, setdescrip] = useState(null);
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



    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        const storageRef = ref(storage, `user/${user.uid}`);

        uploadBytes(storageRef, selectedImage, metadata).then(() => {

            getDownloadURL(ref(storage, `user/${user.uid}`))
                .then(async (url) => {

                    await updateDoc(doc(db, "user", user.uid), {
                        photoURL: url,
                    });
                    setImage(url)
                    console.log("image updated")

                })

        });

    };



    async function createProfile() {
        if (nameTaken) {
            return null;
        }
        else {


                await updateDoc(doc(db, "user", user.uid), {
                    userName: username.toLowerCase() ,
                    descrip: descrip,
                    userNameArray: [...username]
                });
                router.push('/account/profile')
                console.log("updated with image")

 
        }

    }





    function clickGetImg() {
        fileInputRef.current.click();
    }

    useEffect(() => {
        if (username != null) {
            if (username.length > 0) {
                const cref = collection(db, 'user')
                const q = query(cref, where('userName', '==', username.toLowerCase()));
                const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                    if (QuerySnapshot.empty) {
                        setNameTaken(false)
                    }
                    else {
                        setNameTaken(true)
                    }
                    //setPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
                    //setNameTaken(true)
                })
                return unsubscribe;


            }
            else {
                setNameTaken(null)
            }


        }
    }, [username])


    if (loading) {
        return (<h1>Loading bro..</h1>)
    }
    else {
        return (

            <>
                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <h1 className="text-2xl font-bold">Create Your Profile</h1>
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} />
                    <button className="border-2 rounded-full h-[100px] w-[100px] object-cover" onClick={() => clickGetImg()}>
                        {(!image)
                            ? <Icon className="h-[100px] w-[100px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />
                            : <Image className="h-[100px] w-[100px] object-cover rounded-full" src={image} style={{ width: '100px', height: '100px' }} height={100} width={100} alt="User Profile" />
                        }

                    </button>
                    <div className="flex flex-col w-full gap-4">
                        <div className="border-b-2">
                            <p className="text-xs">Username</p>
                            <input type="text" placeholder="Username" className="p-2 focus:outline-none" onChange={(e) => setUsername(e.target.value)} />
                            <div className="text-sm flex justify-start">
                                {(nameTaken == null) ? null : nameTaken ? <h1 className="text-red-500">Username is Taken!</h1> : <h1 className="text-green-500">Username is Avialable!</h1>}
                            </div>
                        </div>
                        <div className="border-b-2">
                            <p className="text-xs">Bio</p>
                            <textarea name="" id="" cols="30" rows="5" className="p-2 focus:outline-none" onChange={(e) => setdescrip(e.target.value)} placeholder="write about you.."></textarea>
                        </div>
                    </div>

                    <button className="w-full bg-red-500 py-2 text-slate-100 rounded-md" onClick={() => createProfile()}>Create</button>

                </div>

            </>
        )

    }
}