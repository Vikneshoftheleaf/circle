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
    const [place, setplace] = useState()
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
                userName: username.toLowerCase(),
                descrip: descrip,
                userNameArray: [...username],
                place: place
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
        return (<h1>Loading...</h1>)
    }
    else {
        return (

            <>
                <div className="flex flex-col justify-center items-center gap-4 p-4">
                    <h1 className="text-2xl font-bold">Create Your Profile</h1>
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e)} />
                    <button className="border-2 rounded-full h-[100px] w-[100px] object-cover overflow-hidden" onClick={() => clickGetImg()}>
                        {(!image)
                            ? <Icon className="h-[100px] w-[100px] text-slate-500  object-cover rounded-full" icon="ph:user-bold" height={50} width={50} />
                            : <Image priority className="h-[100px] w-[100px] object-cover overflow-hidden rounded-full" src={image} style={{ width: '100px', height: '100px' }} height={100} width={100} alt="User Profile" />
                        }

                    </button>
                    <div className="flex flex-col w-full gap-4">
                        <div className="dark:border-0 border-b-2">
                            <p className="text-xs">Username</p>
                            <input type="text" placeholder="Username" className="rounded-md p-2 focus:outline-none w-full" onChange={(e) => setUsername(e.target.value)} />
                            <div className="text-sm flex justify-start">
                                {(nameTaken == null) ? null : nameTaken ? <h1 className="text-red-500">Username is Taken!</h1> : <h1 className="text-green-500">Username is Avialable!</h1>}
                            </div>
                        </div>
                        <div className="dark:border-0 border-b-2">
                            <p className="text-xs">Place</p>
                                <select className="p-2 rounded-md" id="tamilnadu-districts" onChange={(e)=>setplace(e.target.value)}>
                                    <option value="">Select District</option>
                                    <option value="chennai">Chennai</option>
                                    <option value="coimbatore">Coimbatore</option>
                                    <option value="madurai">Madurai</option>
                                    <option value="salem">Salem</option>
                                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                                    <option value="Nellai">Nellai</option>
                                    <option value="Kanchipuram">Kanchipuram</option>
                                    <option value="Tiruvannamalai">Tiruvannamalai</option>
                                    <option value="Vellore">Vellore</option>
                                    <option value="Tiruppur">Tiruppur</option>
                                    <option value="Erode">Erode</option>
                                    <option value="Dindigul">Dindigul</option>
                                    <option value="Thanjavur">Thanjavur</option>
                                    <option value="Cuddalore">Cuddalore</option>
                                    <option value="Trichy">Trichy (Tiruchirappalli)</option>
                                    <option value="Namakkal">Namakkal</option>
                                    <option value="Dharmapuri">Dharmapuri</option>
                                    <option value="Kanyakumari">Kanyakumari</option>
                                    <option value="Ariyalur">Ariyalur</option>
                                    <option value="Perambalur">Perambalur</option>
                                    <option value="Villupuram">Villupuram</option>
                                    <option value="Kallakurichi">Kallakurichi</option>
                                    <option value="Ranipet">Ranipet</option>
                                    <option value="Tirunelveli">Tirunelveli</option>
                                    <option value="Tenkasi">Tenkasi</option>
                                    <option value="Pudukkottai">Pudukkottai</option>
                                    <option value="Sivagangai">Sivagangai</option>
                                    <option value="Theni">Theni</option>
                                    <option value="Ramanathapuram">Ramanathapuram</option>
                                    <option value="Virudhunagar">Virudhunagar</option>
                                    <option value="Thoothukudi">Thoothukudi</option>
                                    <option value="Chengalpattu">Chengalpattu</option>
                                    <option value="Krishnagiri">Krishnagiri</option>
                                    <option value="Nilgiris">Nilgiris</option>
                                </select>

                           
                        </div>
                        <div className="dark:border-0 border-b-2">
                            <p className="text-xs">Bio</p>
                            <textarea name="" id="" cols="30" rows="5" className="w-full rounded-md resiz-none p-2 focus:outline-none" onChange={(e) => setdescrip(e.target.value)} placeholder="write about you.."></textarea>
                        </div>
                    </div>

                    <button className="w-full bg-red-500 py-2 text-slate-100 rounded-md" onClick={() => createProfile()}>Create</button>

                </div>

            </>
        )

    }
}