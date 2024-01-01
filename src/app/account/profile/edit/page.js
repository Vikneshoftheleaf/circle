'use client';
import { useEffect, useRef, useState } from "react"
import Image from "next/image";
import { storage, db, auth } from "@/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuthContext } from "@/context/authcontext";
import { doc, updateDoc, onSnapshot, where, query, collection, QuerySnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import BackBtn from "@/components/backBtn";
export default function EditProfile() {
    const router  = useRouter();
    const { user } = useAuthContext();
    const { profile } = useAuthContext();
    const [image, setImage] = useState(null)
    const [username, setUsername] = useState(null)
    const [displayName, setDsiplayName] = useState(null)
    const [nameTaken, setNameTaken] = useState(null)
    const [descrip, setdescrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const userNameRef = useRef();
    const displayNameRef = useRef();
    const descripRef = useRef();

    useEffect(() => {
        if (username != null) {
            if (username.length > 0) {
                const cref = collection(db, 'user')
                const q = query(cref, where('userName', '==', username));
                const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                    if (QuerySnapshot.empty) {
                        setNameTaken(false)
                    }
                    else if(username == profile.userName)
                    {
                        setNameTaken(null)
                    }
                    else if(username == null)
                    {
                        setNameTaken(null)
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


    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    const metadata = {
        contentType: 'image/jpeg',
    };

    useEffect(() => {
        if (profile.photoURL != null) {
            setUsername(profile.userName)
            setImage(profile.photoURL)
            setDsiplayName(profile.displayName)
            setdescrip(profile.descrip)
            userNameRef.current.value = profile.userName
            descripRef.current.value = profile.descrip
            displayNameRef.current.value = profile.displayName
        }
        else
        {
            setImage(null)
            setUsername(profile.userName)
            setDsiplayName(profile.displayName)
            setdescrip(profile.descrip)
            userNameRef.current.value = profile.userName
            descripRef.current.value = profile.descrip
            displayNameRef.current.value = profile.displayName    
            
        }

    }, [profile])

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        const storageRef = ref(storage, `user/${user.uid}`);

            uploadBytes(storageRef, selectedImage, metadata).then(() => {
    
                getDownloadURL(ref(storage, `user/${user.uid}`))
                    .then(async (url) => {
    
                        await updateDoc(doc(db, "user", user.uid), {
                            photoURL: url,
                        });
                        console.log("image updated")
    
                    })
    
            });
    };

    function clickGetImg() {
        fileInputRef.current.click();
    }

    async function removeProfilePic()
    {
        await updateDoc(doc(db,'user',profile.uid),{
            photoURL:null
        })
        const desertRef = ref(storage, `user/${profile.uid}`);

        // Delete the file
        deleteObject(desertRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });    
    }

    async function updateProfile()
    {
        if(!nameTaken)
        {
            await updateDoc(doc(db,'user',profile.uid),{
                userName: username,
                displayName: displayName,
                descrip: descrip,
                userNameArray: [...username]
            }).then(()=>{
                setNameTaken(null)
                router.back()    
            })
            console.log("profile updated")
        }
        else{
            console.log("username is Taken")
        }

    }

    return (
        <div>
            <div className="flex justify-between items-center pr-4">
                <div className="flex gap-2 items-center">
                    <BackBtn />
                    <h1 className="font-semibold text-lg">Edit Profile</h1>
                </div>
                <button onClick={()=> updateProfile()}>OK</button>
            </div>

            <div className="flex justify-center items-center gap-4 p-4">
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} />
                <div className="border-2 rounded-full h-[100px] w-[100px] object-cover">
                    {(!image)
                        ? <Icon className="h-[100px] w-[100px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />
                        : <Image className="h-[100px] w-[100px] object-cover rounded-full" src={image} style={{ width: '100px', height: '100px' }} height={100} width={100} alt="User Profile" />
                    }

                </div>
                <div className="flex flex-col gap-2">
                    <button onClick={() => clickGetImg()} className="py-2 w-full font-semibold bg-red-50 rounded-md">
                        Change Photo
                    </button>
                    <button onClick={()=> removeProfilePic()} className="px-4 py-2 text-slate-100 rounded-md bg-red-500 font-semibold">Remove Photo</button>


                </div>
            </div>

            <div className="flex flex-col w-full gap-6 px-4">
                <div className="border-b-2">
                    <p className="text-xs ">Name</p>
                    <input ref={displayNameRef} type="text" placeholder="Name" className="p-2 focus:outline-none" onChange={(e) => setDsiplayName(e.target.value)} />
                </div>
                <div className="border-b-2  ">
                <p className="text-xs ">Username</p>
                    <input ref={userNameRef} type="text" placeholder="Username" className="p-2 focus:outline-none" onChange={(e) => setUsername(e.target.value)} />
                    <div className="text-sm flex justify-start">
                        {(nameTaken == null) ? null : nameTaken ? <h1 className="text-red-500">Username is Taken!</h1> : <h1 className="text-green-500">Username is Avialable!</h1>}
                    </div>
                </div>
                <div className="border-b-2">
                <p className="text-xs ">Description</p>
                <textarea ref={descripRef} name="" id="" cols="30" rows="10" className="p-2 focus:outline-none" onChange={(e) => setdescrip(e.target.value)} placeholder="write about you.."></textarea>
                </div>
            </div>
        </div>
    )
}