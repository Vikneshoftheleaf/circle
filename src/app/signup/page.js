"use client";
import { auth, db } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, } from "firebase/auth";
const provider = new GoogleAuthProvider();
import { doc, setDoc } from "firebase/firestore";

import { useState,useRef } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import BackBtn from "@/components/backBtn";

import { useAuthContext } from "@/context/authcontext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const errorRef = useRef();
    

    const {user} = useAuthContext()
  const router = useRouter()
  useEffect(()=>{
    if(user != null)
    {
      router.push('/account/vids')
    }
  },[user])


    function googleSignup() {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            const [displayName] = user.email.split('@')
            setDoc(doc(db, "user", user.uid), {
              uid: user.uid,
              userName:null,
              descrip:null,
              displayName: user.displayName ? user.displayName : displayName[0],
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : null,
              followers: 0,
              following: 0,
              posts: 0,
              followedBy:[],
              followingBy:[],
              verified: false
      
            });
            // IdP data available using getAdditionalUserInfo(result)
            console.log("signned up with google!")
      
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            
            console.log(errorMessage)
            // ...
          });
      }

      function emailSignup(e, email, password) {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            const displayName = user.email.split('@')
            setDoc(doc(db, "user", user.uid), {
              uid: user.uid,
              userName:null,
              descrip:null,
              displayName: user.displayName ? user.displayName : displayName[0],
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : null,
              followers: 0,
              following: 0,
              posts: 0,
              followedBy:[],
              followingBy:[],
              verified: false
      
            });
            console.log('siggned in with email!')
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            const errMsg = errorCode.split('/')
            errorRef.current.textContent = errMsg[1];
      
            // ..
          });
      
      
      }
    return (
        <>
            <BackBtn />
            <div className="m-10 flex flex-col pt-5 justify-center items-center h-full gap-4">
                <div className="lg:w-1/4 flex flex-col gap-4">
                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl font-bold">Sign up for Circle!</h1>
                        <p className="text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, quasi.</p>
                    </div>
                    <div>
                    <p className="text-red-500 text-sm text-center" ref={errorRef}></p>
                   </div>
                    <form onSubmit={(e) => emailSignup(e, email, password)} className="flex flex-col gap-4 ">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="rounded-md dark:border-0 border-2 p-2" placeholder="Email" />
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="rounded-md dark:border-0 border-2 p-2" placeholder="Password" />
                        <button className="px-4 py-2 bg-red-500 text-slate-100 rounded-md font-medium" type="submit">Sign Up</button>
                    </form>

                    <div className="flex gap-2 text-center justify-center items-center text-sm">
                        <h1>Already have an account?</h1><Link href={'/login'} className="text-red-500 font-medium">Log In</Link>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <hr className="h-[2px]  bg-gray-200 w-full rounded-full" />
                        <h1>Or</h1>
                        <hr className="h-[2px] bg-gray-200  w-full rounded-full" />
                    </div>

                    <button className="px-4 py-2 dark:border-0 dark:bg-white/10 dark:backdrop-blur-sm border-2 flex items-center justify-center gap-4 rounded-md" onClick={() => googleSignup()}>
                        <Icon icon="devicon:google" />
                        <h1>Continue with Google</h1>
                    </button>
                </div>

            </div>
        </>
    )
}